import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Form,
  message,
  Spin,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getProvinces, getApiErrorMessage } from "../../services/api";
import {
  getAdminCultureItems,
  getAdminCultureItemById,
  createCultureItem,
  updateCultureItem,
  updateCultureItemStatus,
  deleteCultureItem,
  type AdminCultureItem,
  type CultureCategory,
  type CultureItemStatus,
  type CreateCultureItemRequest,
  type UpdateCultureItemRequest,
} from "../../services/adminApi";
import ContentSummaryCards from "./ContentSummaryCards";

const { Search } = Input;

const categoryLabels: Record<CultureCategory, string> = {
  FESTIVAL: "Lễ hội",
  FOOD: "Ẩm thực",
  COSTUME: "Trang phục",
  INSTRUMENT: "Nhạc cụ",
  DANCE: "Múa",
  LEGEND: "Truyền thuyết",
  CRAFT: "Thủ công",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Bản nháp", color: "default" },
  PUBLISHED: { label: "Đã xuất bản", color: "success" },
  ARCHIVED: { label: "Đã lưu trữ", color: "error" },
};

function formatDate(str: string | undefined): string {
  if (!str) return "-";
  try {
    const d = new Date(str);
    return d.toLocaleDateString("vi-VN");
  } catch {
    return str;
  }
}

export default function ContentManagement() {
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<AdminCultureItem[]>([]);
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [filter, setFilter] = useState<{
    category: string;
    status: string;
    provinceId: string;
    search: string;
  }>({
    category: "all",
    status: "all",
    provinceId: "all",
    search: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [provincesRes, itemsRes] = await Promise.all([
        getProvinces(),
        getAdminCultureItems({
          provinceId: filter.provinceId !== "all" ? Number(filter.provinceId) : undefined,
          category: filter.category !== "all" ? (filter.category as CultureCategory) : undefined,
        }),
      ]);
      setProvinces(provincesRes.map((p) => ({ id: p.id, name: p.name })));
      setContents(itemsRes.data);
    } catch (err) {
      message.error(getApiErrorMessage(err) || "Không thể tải dữ liệu");
      setContents([]);
    } finally {
      setLoading(false);
    }
  }, [filter.provinceId, filter.category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const contentStats = {
    total: contents.length,
    draft: contents.filter((c) => c.status === "DRAFT").length,
    published: contents.filter((c) => c.status === "PUBLISHED").length,
    archived: contents.filter((c) => c.status === "ARCHIVED").length,
  };

  const filteredContents = contents.filter((item) => {
    if (filter.status !== "all" && item.status !== filter.status) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (
        !item.title?.toLowerCase().includes(q) &&
        !item.description?.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const handleStatusChange = async (id: number, newStatus: CultureItemStatus) => {
    try {
      await updateCultureItemStatus(id, newStatus);
      setContents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      message.success("Cập nhật trạng thái thành công");
    } catch (err) {
      message.error(getApiErrorMessage(err) || "Cập nhật thất bại");
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const item = await getAdminCultureItemById(id);
      form.setFieldsValue({
        title: item.title,
        description: item.description,
        category: item.category,
        provinceId: item.province?.id ?? item.provinceId,
      });
      setEditingId(id);
      setIsModalOpen(true);
    } catch (err) {
      message.error(getApiErrorMessage(err) || "Không thể tải chi tiết");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      const provinceId = Number(values.provinceId);
      if (!provinceId) {
        message.error("Vui lòng chọn tỉnh thành");
        return;
      }

      if (editingId) {
        const payload: UpdateCultureItemRequest = {
          provinceId,
          category: values.category as CultureCategory,
          title: values.title,
          description: values.description || undefined,
        };
        await updateCultureItem(editingId, payload);
        message.success("Cập nhật thành công");
      } else {
        const payload: CreateCultureItemRequest = {
          provinceId,
          category: values.category as CultureCategory,
          title: values.title,
          description: values.description || undefined,
        };
        await createCultureItem(payload);
        message.success("Tạo mới thành công");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      if ((err as { errorFields?: unknown[] })?.errorFields) return;
      message.error(getApiErrorMessage(err) || "Thao tác thất bại");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (record: AdminCultureItem) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa "${record.title}"? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteCultureItem(record.id);
          setContents((prev) => prev.filter((c) => c.id !== record.id));
          message.success("Đã xóa thành công");
        } catch (err) {
          message.error(getApiErrorMessage(err) || "Xóa thất bại");
        }
      },
    });
  };

  const columns: ColumnsType<AdminCultureItem> = [
    {
      title: "Ảnh",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      width: 70,
      render: (url) =>
        url ? (
          <Image src={url} alt="" width={48} height={48} style={{ objectFit: "cover" }} />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#999",
            }}
          >
            —
          </div>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Loại",
      dataIndex: "category",
      key: "category",
      render: (cat: CultureCategory) => (
        <Tag color="blue">{categoryLabels[cat] ?? cat}</Tag>
      ),
    },
    {
      title: "Tỉnh",
      dataIndex: ["province", "name"],
      key: "province",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config = statusConfig[status] ?? { label: status, color: "default" };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => formatDate(v),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
          >
            Sửa
          </Button>
          {record.status === "DRAFT" && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => handleStatusChange(record.id, "PUBLISHED")}
            >
              Xuất bản
            </Button>
          )}
          {record.status === "PUBLISHED" && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleStatusChange(record.id, "ARCHIVED")}
            >
              Lưu trữ
            </Button>
          )}
          {record.status === "ARCHIVED" && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                size="small"
                onClick={() => handleStatusChange(record.id, "DRAFT")}
              >
                Khôi phục (Nháp)
              </Button>
              <Button
                type="link"
                icon={<CheckOutlined />}
                size="small"
                onClick={() => handleStatusChange(record.id, "PUBLISHED")}
              >
                Xuất bản lại
              </Button>
            </>
          )}
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              Quản lý Nội dung Văn hóa
            </h2>
            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
              Quản lý mục văn hóa (lễ hội, ẩm thực, trang phục...)
            </p>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Tạo nội dung mới
            </Button>
          </Col>
        </Row>
      </Card>

      <ContentSummaryCards stats={contentStats} />

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Loại nội dung"
              value={filter.category}
              onChange={(value) => setFilter({ ...filter, category: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              {(Object.keys(categoryLabels) as CultureCategory[]).map((k) => (
                <Select.Option key={k} value={k}>
                  {categoryLabels[k]}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Trạng thái"
              value={filter.status}
              onChange={(value) => setFilter({ ...filter, status: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="DRAFT">Bản nháp</Select.Option>
              <Select.Option value="PUBLISHED">Đã xuất bản</Select.Option>
              <Select.Option value="ARCHIVED">Đã lưu trữ</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Tỉnh thành"
              value={filter.provinceId}
              onChange={(value) => setFilter({ ...filter, provinceId: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              {provinces.map((p) => (
                <Select.Option key={p.id} value={String(p.id)}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm..."
              allowClear
              onSearch={(value) => setFilter({ ...filter, search: value })}
            />
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredContents.map((c) => ({ ...c, key: c.id }))}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} mục`,
            }}
          />
        </Spin>
      </Card>

      <Modal
        title={editingId ? "Sửa nội dung" : "Tạo nội dung mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Loại nội dung"
            name="category"
            rules={[{ required: true, message: "Chọn loại" }]}
          >
            <Select placeholder="Chọn loại">
              {(Object.keys(categoryLabels) as CultureCategory[]).map((k) => (
                <Select.Option key={k} value={k}>
                  {categoryLabels[k]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Tỉnh thành"
            name="provinceId"
            rules={[{ required: true, message: "Chọn tỉnh thành" }]}
          >
            <Select placeholder="Chọn tỉnh thành">
              {provinces.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitLoading}
              >
                {editingId ? "Cập nhật" : "Tạo"}
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
