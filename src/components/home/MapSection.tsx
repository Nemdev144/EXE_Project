import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { getCultureItemsByProvince, getProvinces } from '../../services/api';
import type { CultureItem, Province } from '../../types';
import { Loader2, MapPin, X } from 'lucide-react';
import '../../styles/components/mapSection.scss';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Marker dùng icon kiểu Ion "location-outline" (SVG inline)
const ionLocationIcon = L.divIcon({
  className: 'map-section__marker-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
  html: `
    <svg viewBox="0 0 512 512" width="24" height="24" aria-hidden="true" focusable="false">
      <path
        d="M256 48c-79.5 0-144 64.5-144 144 0 108.2 144 272 144 272s144-163.8 144-272c0-79.5-64.5-144-144-144zm0 208a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"
        fill="none"
        stroke="#b91c1c"
        stroke-width="28"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
});

// 5 tỉnh Tây Nguyên cần tương tác
const TAY_NGUYEN_PROVINCES = ['Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng'];

const normalizeName = (name: string): string =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

const cultureItemsCache = new Map<number, CultureItem[]>();

function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const provinceNameToIdRef = useRef<Map<string, number>>(new Map());
  const provinceIdToNameRef = useRef<Map<number, string>>(new Map());

  const [_provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [hoveredProvinceId, setHoveredProvinceId] = useState<number | null>(null);
  const [cultureItems, setCultureItems] = useState<CultureItem[]>([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const activeProvinceId = selectedProvinceId ?? hoveredProvinceId;

  const activeProvinceName = useMemo(() => {
    if (!activeProvinceId) return '';
    return provinceIdToNameRef.current.get(activeProvinceId) || '';
  }, [activeProvinceId]);

  // Load provinces for mapping (name -> id)
  useEffect(() => {
    let mounted = true;
    getProvinces()
      .then((data) => {
        if (!mounted) return;
        setProvinces(data);

        const nameToId = new Map<string, number>();
        const idToName = new Map<number, string>();

        data.forEach((p) => {
          nameToId.set(normalizeName(p.name), p.id);
          idToName.set(p.id, p.name);
        });

        provinceNameToIdRef.current = nameToId;
        provinceIdToNameRef.current = idToName;
      })
      .catch(() => {
        // Không block map, chỉ khiến panel không map được provinceId
      });

    return () => {
      mounted = false;
    };
  }, []);

  const fetchCultureItems = useCallback(async (provinceId: number) => {
    setPanelError(null);
    setPanelLoading(true);

    if (cultureItemsCache.has(provinceId)) {
      setCultureItems(cultureItemsCache.get(provinceId)!);
      setPanelLoading(false);
      return;
    }

    try {
      const items = await getCultureItemsByProvince(provinceId);
      cultureItemsCache.set(provinceId, items);
      setCultureItems(items);
    } catch (e) {
      setCultureItems([]);
      setPanelError('Không thể tải dữ liệu văn hoá');
    } finally {
      setPanelLoading(false);
    }
  }, []);

  const debouncedHoverFetch = useMemo(() => debounce(fetchCultureItems, 200), [fetchCultureItems]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Fix case layout chưa ổn định khiến tile bị “co nhỏ”
    const ro = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    ro.observe(mapRef.current);

    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      try {
        // Center vùng Tây Nguyên (xem rõ 5 tỉnh)
        const center: [number, number] = [13.4, 108.0];

        // Create map
        const map = L.map(mapRef.current, {
          center,
          zoom: 7,
          zoomControl: true,
          minZoom: 5,
          maxZoom: 18,
        });

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Invalidate size để đảm bảo map render đúng
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        setIsMapLoaded(true);

        // Load GeoJSON sau khi map đã hiển thị (ưu tiên file “chuẩn” của bạn)
        setTimeout(() => {
          const geoJsonUrlCandidates = ['/geo/geo-vietnam.geojson', '/geo/vietnam.geojson'];

          const loadFirstAvailableGeoJson = async () => {
            let lastError: unknown = null;

            for (const url of geoJsonUrlCandidates) {
              try {
                const response = await fetch(url);
                const text = await response.text();

                if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
                  throw new Error(`File GeoJSON không tồn tại: ${url}`);
                }
                if (!response.ok) {
                  throw new Error(`Không thể tải file GeoJSON: ${response.status} ${response.statusText}`);
                }
                return JSON.parse(text);
              } catch (e) {
                lastError = e;
              }
            }

            throw lastError || new Error('Không thể tải GeoJSON từ các đường dẫn đã thử.');
          };

          loadFirstAvailableGeoJson()
            .then((geoJsonData) => {
              if (!mapInstanceRef.current) return;

              // Create GeoJSON layer: chỉ 5 tỉnh Tây Nguyên có tương tác
              const markerLayer = L.layerGroup();

              const geoJsonLayer = L.geoJSON(geoJsonData as any, {
                // Ẩn polygon, chỉ dùng để lấy bounds tính vị trí marker
                style: () => ({
                  fillOpacity: 0,
                  color: 'transparent',
                  weight: 0,
                  opacity: 0,
                }),
                onEachFeature: (feature: any, layer: L.Layer) => {
                  const props = feature?.properties || {};
                  const rawName = props.NAME_1 || props.name || props.NAME || 'Unknown';
                  const normalized = normalizeName(String(rawName));
                  const isTayNguyen = TAY_NGUYEN_PROVINCES.some(
                    (tn) => normalizeName(tn) === normalized
                  );

                  if (!isTayNguyen) return;

                  const provinceId = provinceNameToIdRef.current.get(normalized);
                  if (!provinceId || !mapInstanceRef.current) return;

                  let center: L.LatLng | null = null;
                  const anyLayer = layer as any;
                  if (anyLayer.getBounds) {
                    center = anyLayer.getBounds().getCenter();
                  }
                  if (!center) return;

                  const marker = L.marker(center, { icon: ionLocationIcon }).addTo(markerLayer);

                  marker.bindTooltip(String(rawName) || 'Unknown', {
                    permanent: false,
                    direction: 'top',
                    className: 'province-tooltip',
                  });

                  marker.on('mouseover', () => {
                    if (selectedProvinceId) return;
                    setHoveredProvinceId(provinceId);
                    debouncedHoverFetch(provinceId);
                    marker.setZIndexOffset(1000);
                  });

                  marker.on('mouseout', () => {
                    if (selectedProvinceId) return;
                    setHoveredProvinceId(null);
                    marker.setZIndexOffset(0);
                  });

                  marker.on('click', () => {
                    setSelectedProvinceId(provinceId);
                    setHoveredProvinceId(null);
                    fetchCultureItems(provinceId);
                    marker.setZIndexOffset(1500);
                  });
                },
              });

              geoJsonLayer.addTo(mapInstanceRef.current);
              markerLayer.addTo(mapInstanceRef.current);
              geoJsonLayerRef.current = geoJsonLayer;
              markerLayerRef.current = markerLayer;

              // Focus vào vùng Tây Nguyên để nhìn rõ 5 tỉnh
              // (Nếu bạn muốn zoom toàn Việt Nam thì đổi lại geoJsonLayer.getBounds())
              mapInstanceRef.current.setView(center, 7);

              setTimeout(() => {
                mapInstanceRef.current?.invalidateSize();
              }, 100);
            })
            .catch((err) => {
              console.error('Failed to load GeoJSON:', err);
              setMapError(
                err.message ||
                  'Không thể tải dữ liệu bản đồ. Vui lòng đặt file geo-vietnam.geojson hoặc vietnam.geojson vào thư mục public/geo/'
              );
            });
        }, 300);
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setMapError('Không thể khởi tạo bản đồ. Vui lòng thử lại.');
        setIsMapLoaded(true);
      }
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      ro.disconnect();
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
      if (geoJsonLayerRef.current) {
        try {
          geoJsonLayerRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        geoJsonLayerRef.current = null;
      }
      if (markerLayerRef.current) {
        try {
          markerLayerRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        markerLayerRef.current = null;
      }
    };
  }, [debouncedHoverFetch, fetchCultureItems]);

  // Khi click lock tỉnh, panel luôn hiển thị theo selectedProvinceId
  useEffect(() => {
    if (selectedProvinceId) {
      fetchCultureItems(selectedProvinceId);
    }
  }, [fetchCultureItems, selectedProvinceId]);

  return (
    <section className="map-section">
      <div className="map-section__container">
        <h2 className="map-section__title">BẢN ĐỒ TÂY NGUYÊN</h2>
        <p className="map-section__subtitle">
          Hover hoặc click vào 5 tỉnh Tây Nguyên để xem danh sách văn hoá
        </p>

        <div className="map-section__content">
          <div className="map-section__map-wrapper">
            {mapError && (
              <div className="map-section__error">
                <p>{mapError}</p>
              </div>
            )}
            <div ref={mapRef} className="map-section__map" />
            {!isMapLoaded && (
              <div className="map-section__loading">
                <Loader2 className="map-section__spinner" />
                <p>Đang tải bản đồ...</p>
              </div>
            )}
          </div>

          {/* Panel bên phải (desktop) */}
          <div className="map-section__panel">
            <div className="map-section__panel-header">
              <h3 className="map-section__panel-title">
                {activeProvinceId ? `Văn hoá ${activeProvinceName || ''}` : 'Văn hoá Tây Nguyên'}
              </h3>

              {selectedProvinceId && (
                <button
                  className="map-section__panel-close"
                  onClick={() => {
                    setSelectedProvinceId(null);
                    setCultureItems([]);
                    setPanelError(null);
                    setPanelLoading(false);
                  }}
                  aria-label="Bỏ chọn tỉnh"
                  title="Bỏ chọn"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="map-section__panel-content">
              {!activeProvinceId ? (
                <div className="map-section__panel-empty">
                  <MapPin size={48} className="map-section__panel-empty-icon" />
                  <p>Hover hoặc click vào tỉnh để xem văn hoá</p>
                </div>
              ) : panelLoading ? (
                <div className="map-section__panel-loading">
                  <Loader2 className="map-section__spinner" />
                  <p>Đang tải...</p>
                </div>
              ) : panelError ? (
                <div className="map-section__panel-error">
                  <p>{panelError}</p>
                </div>
              ) : cultureItems.length === 0 ? (
                <div className="map-section__panel-empty">
                  <p>Chưa có dữ liệu văn hoá</p>
                </div>
              ) : (
                <div className="map-section__panel-list">
                  {cultureItems.map((item) => (
                    <div key={item.id} className="map-section__panel-item">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="map-section__panel-item-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="map-section__panel-item-image map-section__panel-item-image--placeholder" />
                      )}
                      <div className="map-section__panel-item-content">
                        <div className="map-section__panel-item-title">{item.title}</div>
                        <div className="map-section__panel-item-description">{item.description}</div>
                        <div className="map-section__panel-item-category">{item.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}