import '../../styles/components/learn/_related-tours.scss';

interface Tour {
  id: number;
  title: string;
  description: string;
  price: string;
  thumbnailUrl: string;
}

interface RelatedToursProps {
  tours: Tour[];
}

export default function RelatedTours({ tours }: RelatedToursProps) {
  return (
    <div className="related-tours">
      <h2 className="related-tours__title">TRẢI NGHIỆM VĂN HOÁ NGAY TẠI TÂY NGUYÊN</h2>
      <p className="related-tours__subtitle">
        Chọn một tour phù hợp để chạm vào không gian cồng chiêng & đời sống bản địa.
      </p>
      <div className="related-tours__grid">
        {tours.map((tour) => (
          <div key={tour.id} className="related-tours__card">
            <img
              src={tour.thumbnailUrl}
              alt={tour.title}
              className="related-tours__image"
            />
            <div className="related-tours__content">
              <h3 className="related-tours__card-title">{tour.title}</h3>
              <p className="related-tours__card-description">{tour.description}</p>
              <div className="related-tours__card-footer">
                <span className="related-tours__card-price">{tour.price}</span>
                <button className="related-tours__card-button">Đặt ngay</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
