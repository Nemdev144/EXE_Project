import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Tabs,
  Modal,
  Descriptions,
  App,
  Spin,
  Alert,
  Typography,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  Divider,
  Row,
  Col,
} from "antd";
import {
  BookOutlined,
  FolderOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import LearnSummaryCards from "./LearnSummaryCards";
import type { ColumnsType } from "antd/es/table";
import {
  getAdminLearnCategories,
  getAdminLearnModules,
  getAdminLearnModuleById,
  getAdminLearnLessonById,
  getAdminLearnQuizById,
  createAdminLearnCategory,
  updateAdminLearnCategory,
  deleteAdminLearnCategory,
  createAdminLearnModule,
  updateAdminLearnModule,
  deleteAdminLearnModule,
  createAdminLearnLesson,
  updateAdminLearnLesson,
  deleteAdminLearnLesson,
  createAdminLearnQuiz,
  updateAdminLearnQuiz,
  deleteAdminLearnQuiz,
  type AdminLearnCategory,
  type AdminLearnModule,
  type AdminLearnLesson,
  type AdminLearnQuiz,
} from "../../services/adminApi";

const { Title, Text } = Typography;
const { TextArea } = Input;

const difficultyLabels: Record<string, string> = {
  BASIC: "Cơ bản",
  INTERMEDIATE: "Trung bình",
  ADVANCED: "Nâng cao",
};

const DIFFICULTY_OPTIONS = [
  { value: "BASIC", label: "Cơ bản" },
  { value: "INTERMEDIATE", label: "Trung bình" },
  { value: "ADVANCED", label: "Nâng cao" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LearnManagement() {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState<AdminLearnCategory[]>([]);
  const [modules, setModules] = useState<AdminLearnModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailType, setDetailType] = useState<"module" | "lesson" | "quiz">("module");
  const [detailData, setDetailData] = useState<
    AdminLearnModule | AdminLearnLesson | AdminLearnQuiz | null
  >(null);

  // Category form
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryEditId, setCategoryEditId] = useState<number | null>(null);
  const [categoryForm] = Form.useForm();
  const [categorySaving, setCategorySaving] = useState(false);

  // Module form
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [moduleEditId, setModuleEditId] = useState<number | null>(null);
  const [moduleForm] = Form.useForm();
  const [moduleSaving, setModuleSaving] = useState(false);

  // Lesson form
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [lessonEditId, setLessonEditId] = useState<number | null>(null);
  const [lessonForm] = Form.useForm();
  const [lessonSaving, setLessonSaving] = useState(false);

  // Quiz form (create)
  const [quizCreateModalOpen, setQuizCreateModalOpen] = useState(false);
  const [quizCreateForm] = Form.useForm();
  const [quizCreateSaving, setQuizCreateSaving] = useState(false);

  // Quiz edit (chỉnh sửa đáp án)
  const [quizEditModalOpen, setQuizEditModalOpen] = useState(false);
  const [quizEditData, setQuizEditData] = useState<AdminLearnQuiz | null>(null);
  const [quizEditSaving, setQuizEditSaving] = useState(false);

  const [searchCategory, setSearchCategory] = useState("");
  const [searchModule, setSearchModule] = useState("");
  const [searchLesson, setSearchLesson] = useState("");
  const [filterModuleCategory, setFilterModuleCategory] = useState<string>("all");

  const fetchCategories = async () => {
    try {
      const data = await getAdminLearnCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Không thể tải danh mục");
    }
  };

  const fetchModules = async () => {
    try {
      const data = await getAdminLearnModules();
      setModules(data);
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Không thể tải module");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchCategories(), fetchModules()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModuleDetail = async (moduleId: number) => {
    setDetailType("module");
    setDetailModalOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const data = await getAdminLearnModuleById(moduleId);
      setDetailData(data);
    } catch {
      message.error("Không thể tải chi tiết module");
    } finally {
      setDetailLoading(false);
    }
  };

  const openLessonDetail = async (lessonId: number) => {
    setDetailType("lesson");
    setDetailModalOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const data = await getAdminLearnLessonById(lessonId);
      setDetailData(data);
    } catch {
      message.error("Không thể tải chi tiết bài học");
    } finally {
      setDetailLoading(false);
    }
  };

  const openQuizDetail = async (quizId: number) => {
    setDetailType("quiz");
    setDetailModalOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const data = await getAdminLearnQuizById(quizId);
      setDetailData(data);
    } catch {
      message.error("Không thể tải chi tiết quiz");
    } finally {
      setDetailLoading(false);
    }
  };

  // ========== Category CRUD ==========
  const handleOpenCategoryForm = (record?: AdminLearnCategory) => {
    if (record) {
      setCategoryEditId(record.id);
      categoryForm.setFieldsValue({
        name: record.name,
        slug: record.slug,
        orderIndex: record.orderIndex,
      });
    } else {
      setCategoryEditId(null);
      categoryForm.resetFields();
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      const values = await categoryForm.validateFields();
      setCategorySaving(true);
      if (categoryEditId) {
        await updateAdminLearnCategory(categoryEditId, values);
        message.success("Cập nhật danh mục thành công");
      } else {
        await createAdminLearnCategory({
          ...values,
          slug: values.slug || slugify(values.name),
        });
        message.success("Tạo danh mục thành công");
      }
      setCategoryModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setCategorySaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteAdminLearnCategory(id);
      message.success("Đã xóa danh mục");
      fetchCategories();
    } catch {
      message.error("Không thể xóa danh mục");
    }
  };

  // ========== Module CRUD ==========
  const handleOpenModuleForm = (record?: AdminLearnModule) => {
    if (record) {
      setModuleEditId(record.id);
      moduleForm.setFieldsValue({
        title: record.title,
        slug: record.slug,
        categoryId: record.categoryId,
        thumbnailUrl: record.thumbnailUrl,
        culturalEtiquetteTitle: record.culturalEtiquetteTitle,
        culturalEtiquetteText: record.culturalEtiquetteText,
      });
    } else {
      setModuleEditId(null);
      moduleForm.resetFields();
    }
    setModuleModalOpen(true);
  };

  const handleSaveModule = async () => {
    try {
      const values = await moduleForm.validateFields();
      setModuleSaving(true);
      if (moduleEditId) {
        await updateAdminLearnModule(moduleEditId, values);
        message.success("Cập nhật module thành công");
      } else {
        await createAdminLearnModule({
          ...values,
          slug: values.slug || slugify(values.title),
        });
        message.success("Tạo module thành công");
      }
      setModuleModalOpen(false);
      fetchModules();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setModuleSaving(false);
    }
  };

  const handleDeleteModule = async (id: number) => {
    try {
      await deleteAdminLearnModule(id);
      message.success("Đã xóa module");
      fetchModules();
    } catch {
      message.error("Không thể xóa module");
    }
  };

  // ========== Lesson CRUD ==========
  const handleOpenLessonForm = (record?: AdminLearnLesson & { moduleId?: number }) => {
    if (record) {
      setLessonEditId(record.id);
      lessonForm.setFieldsValue({
        title: record.title,
        slug: record.slug,
        moduleId: record.moduleId,
        objectiveText: record.objectiveText,
        difficulty: record.difficulty,
        estimatedMinutes: record.estimatedMinutes,
        videoUrl: record.videoUrl,
        imageUrl: record.imageUrl,
        contentJson: record.contentJson,
        orderIndex: record.orderIndex,
      });
    } else {
      setLessonEditId(null);
      lessonForm.resetFields();
    }
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async () => {
    try {
      const values = await lessonForm.validateFields();
      setLessonSaving(true);
      if (lessonEditId) {
        await updateAdminLearnLesson(lessonEditId, values);
        message.success("Cập nhật bài học thành công");
      } else {
        await createAdminLearnLesson({
          ...values,
          slug: values.slug || slugify(values.title),
        });
        message.success("Tạo bài học thành công");
      }
      setLessonModalOpen(false);
      fetchModules();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setLessonSaving(false);
    }
  };

  const handleDeleteLesson = async (id: number) => {
    try {
      await deleteAdminLearnLesson(id);
      message.success("Đã xóa bài học");
      fetchModules();
    } catch {
      message.error("Không thể xóa bài học");
    }
  };

  // ========== Quiz Create ==========
  const handleOpenQuizCreate = () => {
    quizCreateForm.resetFields();
    quizCreateForm.setFieldsValue({
      questions: [
        {
          questionText: "",
          hintText: "",
          orderIndex: 0,
          options: [
            { label: "A", optionText: "", isCorrect: false },
            { label: "B", optionText: "", isCorrect: false },
          ],
        },
      ],
    });
    setQuizCreateModalOpen(true);
  };

  const handleSaveQuizCreate = async () => {
    try {
      const values = await quizCreateForm.validateFields();
      setQuizCreateSaving(true);
      const questions = (values.questions ?? []).map((q: any, i: number) => ({
        questionText: q.questionText,
        hintText: q.hintText || "",
        orderIndex: i,
        options: (q.options ?? []).map((o: any) => ({
          label: o.label,
          optionText: o.optionText,
          isCorrect: !!o.isCorrect,
        })),
      }));
      await createAdminLearnQuiz({
        moduleId: values.moduleId,
        title: values.title,
        timeLimitMinutes: values.timeLimitMinutes,
        difficulty: values.difficulty,
        objective: values.objective,
        rules: values.rules ? values.rules.split("\n").filter(Boolean) : [],
        questions,
      });
      message.success("Tạo quiz thành công");
      setQuizCreateModalOpen(false);
      fetchModules();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setQuizCreateSaving(false);
    }
  };

  // ========== Quiz Edit (chỉnh sửa đáp án) ==========
  const handleOpenQuizEdit = async (quizId: number) => {
    setDetailModalOpen(false);
    try {
      const data = await getAdminLearnQuizById(quizId);
      setQuizEditData(data);
      setQuizEditModalOpen(true);
    } catch {
      message.error("Không thể tải quiz");
    }
  };

  const handleSaveQuizEdit = async (formValues: Record<string, any>) => {
    if (!quizEditData) return;
    try {
      setQuizEditSaving(true);
      const questions = (formValues.questions ?? quizEditData.questions).map((q: any, i: number) => ({
        questionText: q.questionText,
        hintText: q.hintText || "",
        orderIndex: i,
        options: (q.options ?? []).map((o: any) => ({
          id: o.id,
          label: o.label,
          optionText: o.optionText,
          isCorrect: !!o.isCorrect,
        })),
      }));
      await updateAdminLearnQuiz(quizEditData.id, {
        title: formValues.title ?? quizEditData.title,
        timeLimitMinutes: formValues.timeLimitMinutes ?? quizEditData.timeLimitMinutes,
        difficulty: formValues.difficulty ?? quizEditData.difficulty,
        objective: formValues.objective ?? quizEditData.objective,
        rules: formValues.rules ? formValues.rules.split("\n").filter(Boolean) : quizEditData.rules,
        questions,
      });
      message.success("Cập nhật quiz thành công");
      setQuizEditModalOpen(false);
      setQuizEditData(null);
      fetchModules();
    } catch {
      message.error("Cập nhật quiz thất bại");
    } finally {
      setQuizEditSaving(false);
    }
  };

  const handleDeleteQuiz = async (id: number) => {
    try {
      await deleteAdminLearnQuiz(id);
      message.success("Đã xóa quiz");
      setDetailModalOpen(false);
      setDetailData(null);
      fetchModules();
    } catch {
      message.error("Không thể xóa quiz");
    }
  };

  const stats = {
    totalCategories: categories.length,
    totalModules: modules.length,
    totalLessons: modules.reduce((sum, m) => sum + (m.lessonsCount ?? m.lessons?.length ?? 0), 0),
    totalQuizzes: modules.filter((m) => m.quizPrompt).length,
  };

  const filteredCategories = categories.filter(
    (c) =>
      !searchCategory ||
      c.name?.toLowerCase().includes(searchCategory.toLowerCase()) ||
      c.slug?.toLowerCase().includes(searchCategory.toLowerCase()),
  );

  const filteredModules = modules.filter((m) => {
    if (filterModuleCategory !== "all" && m.categoryId !== Number(filterModuleCategory)) return false;
    if (
      searchModule &&
      !m.title?.toLowerCase().includes(searchModule.toLowerCase()) &&
      !m.categoryName?.toLowerCase().includes(searchModule.toLowerCase())
    )
      return false;
    return true;
  });

  const allLessonsRaw = modules.flatMap((m) =>
    (m.lessons ?? []).map((l) => ({
      ...l,
      moduleTitle: m.title,
      categoryName: m.categoryName,
      moduleId: m.id,
    })),
  );

  const filteredLessons = allLessonsRaw.filter(
    (l) =>
      !searchLesson ||
      l.title?.toLowerCase().includes(searchLesson.toLowerCase()) ||
      l.moduleTitle?.toLowerCase().includes(searchLesson.toLowerCase()),
  );

  const categoryColumns: ColumnsType<AdminLearnCategory> = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tên", dataIndex: "name", key: "name", render: (t) => <strong>{t}</strong> },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    { title: "Thứ tự", dataIndex: "orderIndex", key: "orderIndex", width: 100 },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleOpenCategoryForm(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const moduleColumns: ColumnsType<AdminLearnModule> = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    {
      title: "Module",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.categoryName}</div>
        </div>
      ),
    },
    { title: "Slug", dataIndex: "slug", key: "slug", width: 150 },
    {
      title: "Bài học",
      key: "lessonsCount",
      width: 100,
      render: (_, record) => record.lessonsCount ?? record.lessons?.length ?? 0,
    },
    {
      title: "Thời lượng",
      key: "durationMinutes",
      width: 100,
      render: (_, record) => `${record.durationMinutes ?? 0} phút`,
    },
    {
      title: "Quiz",
      key: "quiz",
      width: 80,
      render: (_, record) =>
        record.quizPrompt ? <Tag color="green">Có</Tag> : <Tag color="default">Không</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => openModuleDetail(record.id)}>
            Xem
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleOpenModuleForm(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa module?"
            description="Tất cả bài học và quiz trong module sẽ bị ảnh hưởng."
            onConfirm={() => handleDeleteModule(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  type LessonRow = (typeof allLessonsRaw)[number];
  const lessonColumns: ColumnsType<LessonRow> = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    {
      title: "Bài học",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.moduleTitle}</div>
        </div>
      ),
    },
    { title: "Module", dataIndex: "moduleTitle", key: "moduleTitle", width: 180 },
    { title: "Thứ tự", dataIndex: "orderIndex", key: "orderIndex", width: 90 },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      width: 100,
      render: (v: number) => (v != null ? `${v} phút` : "—"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => openLessonDetail(record.id)}>
            Xem
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenLessonForm({ ...record, moduleId: record.moduleId })}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa bài học?"
            onConfirm={() => handleDeleteLesson(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "categories",
      label: (
        <span>
          <FolderOutlined />
          Danh mục ({stats.totalCategories})
        </span>
      ),
      children: (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="middle">
            <Col xs={24} sm={12} md={10}>
              <Input
                placeholder="Tìm theo tên, slug..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={14} style={{ textAlign: "right" }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenCategoryForm()}>
                Tạo danh mục
              </Button>
            </Col>
          </Row>
          <Table
            columns={categoryColumns}
            dataSource={filteredCategories}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showTotal: (t) => `Tổng ${t} danh mục` }}
          />
        </>
      ),
    },
    {
      key: "modules",
      label: (
        <span>
          <BookOutlined />
          Module ({stats.totalModules})
        </span>
      ),
      children: (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="middle">
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 4, fontSize: 13, color: "#595959" }}>Danh mục</div>
              <Select
                style={{ width: "100%" }}
                placeholder="Tất cả"
                value={filterModuleCategory}
                onChange={setFilterModuleCategory}
              >
                <Select.Option value="all">Tất cả danh mục</Select.Option>
                {categories.map((c) => (
                  <Select.Option key={c.id} value={String(c.id)}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: 4, fontSize: 13, color: "#595959" }}>Tìm kiếm</div>
              <Input
                placeholder="Tìm theo tiêu đề, danh mục..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                value={searchModule}
                onChange={(e) => setSearchModule(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={10} style={{ textAlign: "right" }}>
              <div style={{ marginBottom: 4, fontSize: 13, color: "transparent" }}>.</div>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModuleForm()}>
                Tạo module
              </Button>
            </Col>
          </Row>
          <Table
            columns={moduleColumns}
            dataSource={filteredModules}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showTotal: (t) => `Tổng ${t} module` }}
          />
        </>
      ),
    },
    {
      key: "lessons",
      label: (
        <span>
          <FileTextOutlined />
          Bài học ({stats.totalLessons})
        </span>
      ),
      children: (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="middle">
            <Col xs={24} sm={12} md={10}>
              <Input
                placeholder="Tìm theo tiêu đề bài học, module..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                value={searchLesson}
                onChange={(e) => setSearchLesson(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={14} style={{ textAlign: "right" }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenLessonForm()}>
                Tạo bài học
              </Button>
            </Col>
          </Row>
          <Table
            columns={lessonColumns}
            dataSource={filteredLessons}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showTotal: (t) => `Tổng ${t} bài học` }}
          />
        </>
      ),
    },
    {
      key: "quizzes",
      label: (
        <span>
          <QuestionCircleOutlined />
          Quiz ({stats.totalQuizzes})
        </span>
      ),
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 20 }} align="middle">
            <Col flex="auto">
              <Text type="secondary">
                Quiz được gắn với module. Tạo quiz mới hoặc sửa đáp án trên từng quiz.
              </Text>
            </Col>
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenQuizCreate}>
                Tạo quiz mới
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            {modules
              .filter((m) => m.quizPrompt)
              .map((m) => (
                <Col xs={24} md={12} lg={8} key={m.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      height: "100%",
                    }}
                    styles={{ body: { padding: 20 } }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#1f2937" }}>{m.title}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                          {m.quizPrompt?.totalQuestions} câu · {m.quizPrompt?.timeLimitMinutes} phút
                        </div>
                      </div>
                      <Tag color="green">Quiz</Tag>
                    </div>
                    <Space>
                      {m.quizPrompt?.id && (
                        <>
                          <Button type="link" size="small" onClick={() => openQuizDetail(m.quizPrompt!.id)}>
                            Xem
                          </Button>
                          <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleOpenQuizEdit(m.quizPrompt!.id)}
                          >
                            Sửa đáp án
                          </Button>
                          <Popconfirm
                            title="Xóa quiz?"
                            onConfirm={() => handleDeleteQuiz(m.quizPrompt!.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                          >
                            <Button type="link" size="small" danger>
                              Xóa
                            </Button>
                          </Popconfirm>
                        </>
                      )}
                    </Space>
                  </Card>
                </Col>
              ))}
          </Row>
          {stats.totalQuizzes === 0 && (
            <Alert
              message="Chưa có quiz nào"
              description="Nhấn 'Tạo quiz mới' để thêm quiz cho module."
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </div>
      ),
    },
  ];

  const renderDetailContent = () => {
    if (detailLoading) {
      return (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
          <p style={{ marginTop: 8 }}>Đang tải...</p>
        </div>
      );
    }
    if (!detailData) return null;

    if (detailType === "module") {
      const d = detailData as AdminLearnModule;
      return (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="ID">{d.id}</Descriptions.Item>
          <Descriptions.Item label="Tiêu đề">{d.title}</Descriptions.Item>
          <Descriptions.Item label="Slug">{d.slug}</Descriptions.Item>
          <Descriptions.Item label="Danh mục">{d.categoryName}</Descriptions.Item>
          <Descriptions.Item label="Số bài học">
            {d.lessonsCount ?? d.lessons?.length ?? 0}
          </Descriptions.Item>
          <Descriptions.Item label="Thời lượng">{d.durationMinutes} phút</Descriptions.Item>
          <Descriptions.Item label="Cultural Etiquette">{d.culturalEtiquetteTitle}</Descriptions.Item>
          {d.lessons && d.lessons.length > 0 && (
            <Descriptions.Item label="Bài học">
              <Space direction="vertical" size="small">
                {d.lessons.map((l) => (
                  <Button key={l.id} type="link" size="small" onClick={() => openLessonDetail(l.id)}>
                    {l.orderIndex}. {l.title}
                  </Button>
                ))}
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>
      );
    }

    if (detailType === "lesson") {
      const d = detailData as AdminLearnLesson;
      return (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="ID">{d.id}</Descriptions.Item>
          <Descriptions.Item label="Tiêu đề">{d.title}</Descriptions.Item>
          <Descriptions.Item label="Slug">{d.slug}</Descriptions.Item>
          <Descriptions.Item label="Module">{d.moduleTitle}</Descriptions.Item>
          <Descriptions.Item label="Danh mục">{d.categoryName}</Descriptions.Item>
          <Descriptions.Item label="Độ khó">
            <Tag>{difficultyLabels[d.difficulty] ?? d.difficulty}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thời lượng ước tính">{d.estimatedMinutes} phút</Descriptions.Item>
          <Descriptions.Item label="Lượt xem">{d.viewsCount ?? 0}</Descriptions.Item>
        </Descriptions>
      );
    }

    if (detailType === "quiz") {
      const d = detailData as AdminLearnQuiz;
      return (
        <>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{d.id}</Descriptions.Item>
            <Descriptions.Item label="Module ID">{d.moduleId}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">{d.title}</Descriptions.Item>
            <Descriptions.Item label="Thời gian">{d.timeLimitMinutes} phút</Descriptions.Item>
            <Descriptions.Item label="Độ khó">
              <Tag>{difficultyLabels[d.difficulty] ?? d.difficulty}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mục tiêu">{d.objective || "—"}</Descriptions.Item>
            <Descriptions.Item label="Số câu hỏi">{d.totalQuestions}</Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleOpenQuizEdit(d.id)}>
              Chỉnh sửa đáp án
            </Button>
          </div>
          {d.questions && d.questions.length > 0 && (
            <div style={{ marginTop: 16, maxHeight: 300, overflow: "auto" }}>
              {d.questions.map((q, i) => (
                <div
                  key={q.id}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    background: "#fafafa",
                    borderRadius: 8,
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <strong>Câu {i + 1}:</strong> {q.questionText}
                  {q.hintText && (
                    <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 4 }}>Gợi ý: {q.hintText}</div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    {q.options?.map((opt) => (
                      <div
                        key={opt.id}
                        style={{
                          padding: "4px 8px",
                          marginTop: 4,
                          background: opt.isCorrect ? "#f6ffed" : "#fff",
                          borderLeft: opt.isCorrect ? "3px solid #52c41a" : "3px solid transparent",
                        }}
                      >
                        {opt.label}. {opt.optionText}
                        {opt.isCorrect && (
                          <Tag color="success" style={{ marginLeft: 8 }}>
                            Đáp án đúng
                          </Tag>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <LearnSummaryCards stats={stats} />

      <div style={{ marginBottom: 8 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>
          Quản lý Học nhanh
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Quản lý danh mục, module, bài học và quiz. Tạo mới, chỉnh sửa và xóa nội dung học tập.
        </Text>
      </div>

      {error && (
        <Alert message="Lỗi" description={error} type="error" showIcon style={{ marginBottom: 16 }} />
      )}

      <Card
        style={{
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          style={{ marginTop: 8 }}
        />
      </Card>

      {/* Modal Chi tiết */}
      <Modal
        title={
          detailType === "module"
            ? "Chi tiết Module"
            : detailType === "lesson"
              ? "Chi tiết Bài học"
              : "Chi tiết Quiz"
        }
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setDetailData(null);
        }}
        footer={[<Button key="close" onClick={() => setDetailModalOpen(false)}>Đóng</Button>]}
        width={700}
      >
        {renderDetailContent()}
      </Modal>

      {/* Modal Danh mục */}
      <Modal
        title={categoryEditId ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        open={categoryModalOpen}
        onCancel={() => setCategoryModalOpen(false)}
        onOk={handleSaveCategory}
        confirmLoading={categorySaving}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input placeholder="VD: Văn hóa Tây Nguyên" />
          </Form.Item>
          <Form.Item label="Slug" name="slug">
            <Input placeholder="Tự động từ tên nếu để trống" />
          </Form.Item>
          <Form.Item label="Thứ tự" name="orderIndex">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Module */}
      <Modal
        title={moduleEditId ? "Chỉnh sửa module" : "Tạo module mới"}
        open={moduleModalOpen}
        onCancel={() => setModuleModalOpen(false)}
        onOk={handleSaveModule}
        confirmLoading={moduleSaving}
        okText="Lưu"
        cancelText="Hủy"
        width={560}
      >
        <Form form={moduleForm} layout="vertical">
          <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
            <Input placeholder="VD: Cồng chiêng Tây Nguyên" />
          </Form.Item>
          <Form.Item label="Slug" name="slug">
            <Input placeholder="Tự động từ tiêu đề nếu để trống" />
          </Form.Item>
          <Form.Item label="Danh mục" name="categoryId" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn danh mục"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>
          <Form.Item label="Ảnh (URL)" name="thumbnailUrl">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item label="Cultural Etiquette - Tiêu đề" name="culturalEtiquetteTitle">
            <Input />
          </Form.Item>
          <Form.Item label="Cultural Etiquette - Nội dung" name="culturalEtiquetteText">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Bài học */}
      <Modal
        title={lessonEditId ? "Chỉnh sửa bài học" : "Tạo bài học mới"}
        open={lessonModalOpen}
        onCancel={() => setLessonModalOpen(false)}
        onOk={handleSaveLesson}
        confirmLoading={lessonSaving}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={lessonForm} layout="vertical">
          <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
            <Input placeholder="VD: Lịch sử Cồng chiêng" />
          </Form.Item>
          <Form.Item label="Slug" name="slug">
            <Input placeholder="Tự động từ tiêu đề nếu để trống" />
          </Form.Item>
          <Form.Item label="Module" name="moduleId" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn module"
              options={modules.map((m) => ({ value: m.id, label: m.title }))}
            />
          </Form.Item>
          <Form.Item label="Độ khó" name="difficulty">
            <Select options={DIFFICULTY_OPTIONS} />
          </Form.Item>
          <Form.Item label="Thời lượng (phút)" name="estimatedMinutes">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Mục tiêu" name="objectiveText">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Video URL" name="videoUrl">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item label="Ảnh URL" name="imageUrl">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item label="Nội dung (JSON)" name="contentJson">
            <TextArea rows={4} placeholder='{"blocks": [...]}' />
          </Form.Item>
          <Form.Item label="Thứ tự" name="orderIndex">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Tạo Quiz */}
      <Modal
        title="Tạo quiz mới"
        open={quizCreateModalOpen}
        onCancel={() => setQuizCreateModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={quizCreateForm} layout="vertical" onFinish={handleSaveQuizCreate}>
          <Form.Item label="Module" name="moduleId" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn module"
              options={modules.map((m) => ({ value: m.id, label: m.title }))}
            />
          </Form.Item>
          <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
            <Input placeholder="VD: Quiz Cồng chiêng" />
          </Form.Item>
          <Form.Item label="Thời gian (phút)" name="timeLimitMinutes" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Độ khó" name="difficulty" rules={[{ required: true }]}>
            <Select options={DIFFICULTY_OPTIONS} />
          </Form.Item>
          <Form.Item label="Mục tiêu" name="objective">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Quy tắc (mỗi dòng một quy tắc)" name="rules">
            <TextArea rows={2} placeholder="Mỗi dòng một quy tắc" />
          </Form.Item>
          <Divider orientation="left">Câu hỏi</Divider>
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, "questionText"]}
                      label="Câu hỏi"
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "hintText"]} label="Gợi ý">
                      <Input />
                    </Form.Item>
                    <Form.List name={[name, "options"]}>
                      {(optFields, { add: addOpt, remove: removeOpt }) => (
                        <>
                          {optFields.map(({ key: ok, name: on }) => (
                            <div
                              key={ok}
                              style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "options", on, "label"]}
                                style={{ width: 60, marginBottom: 0 }}
                              >
                                <Input placeholder="A" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "options", on, "optionText"]}
                                rules={[{ required: true }]}
                                style={{ flex: 1, marginBottom: 0 }}
                              >
                                <Input placeholder="Nội dung đáp án" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "options", on, "isCorrect"]}
                                style={{ marginBottom: 0 }}
                              >
                                <Select
                                  style={{ width: 100 }}
                                  options={[
                                    { value: true, label: "Đúng" },
                                    { value: false, label: "Sai" },
                                  ]}
                                />
                              </Form.Item>
                              <Button type="link" danger size="small" onClick={() => removeOpt(on)}>
                                Xóa
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() =>
                              addOpt({
                                label: String.fromCharCode(65 + optFields.length),
                                optionText: "",
                                isCorrect: false,
                              })
                            }
                            block
                          >
                            + Thêm đáp án
                          </Button>
                        </>
                      )}
                    </Form.List>
                    <Button
                      type="link"
                      danger
                      size="small"
                      onClick={() => remove(name)}
                      style={{ marginTop: 8 }}
                    >
                      Xóa câu hỏi
                    </Button>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      questionText: "",
                      hintText: "",
                      orderIndex: fields.length,
                      options: [
                        { label: "A", optionText: "", isCorrect: false },
                        { label: "B", optionText: "", isCorrect: false },
                      ],
                    })
                  }
                  block
                >
                  + Thêm câu hỏi
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={quizCreateSaving}>
                Tạo quiz
              </Button>
              <Button onClick={() => setQuizCreateModalOpen(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Chỉnh sửa Quiz (đáp án) */}
      <Modal
        title="Chỉnh sửa đáp án Quiz"
        open={quizEditModalOpen}
        onCancel={() => {
          setQuizEditModalOpen(false);
          setQuizEditData(null);
        }}
        footer={null}
        width={720}
      >
        {quizEditData && <QuizEditForm quiz={quizEditData} onSave={handleSaveQuizEdit} onCancel={() => setQuizEditModalOpen(false)} saving={quizEditSaving} />}
      </Modal>
    </Space>
  );
}

// Component riêng cho form sửa quiz (tránh lỗi hooks)
function QuizEditForm({
  quiz,
  onSave,
  onCancel,
  saving,
}: {
  quiz: AdminLearnQuiz;
  onSave: (values: any) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        title: quiz.title,
        timeLimitMinutes: quiz.timeLimitMinutes,
        difficulty: quiz.difficulty,
        objective: quiz.objective,
        rules: (quiz.rules ?? []).join("\n"),
        questions: (quiz.questions ?? []).map((q) => ({
          ...q,
          options: q.options ?? [],
        })),
      }}
      onFinish={onSave}
    >
      <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Thời gian (phút)" name="timeLimitMinutes" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Độ khó" name="difficulty" rules={[{ required: true }]}>
        <Select options={DIFFICULTY_OPTIONS} />
      </Form.Item>
      <Form.Item label="Mục tiêu" name="objective">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item label="Quy tắc (mỗi dòng một quy tắc)" name="rules">
        <TextArea rows={3} />
      </Form.Item>
      <Divider orientation="left">Câu hỏi và đáp án</Divider>
      <Form.List name="questions">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card key={key} size="small" style={{ marginBottom: 16 }}>
                <Form.Item
                  {...restField}
                  name={[name, "questionText"]}
                  label="Câu hỏi"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item {...restField} name={[name, "hintText"]} label="Gợi ý">
                  <Input />
                </Form.Item>
                <Form.List name={[name, "options"]}>
                  {(optFields, { add: addOpt, remove: removeOpt }) => (
                    <>
                      {optFields.map(({ key: ok, name: on }) => (
                        <div
                          key={ok}
                          style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "options", on, "label"]}
                            style={{ width: 60, marginBottom: 0 }}
                          >
                            <Input placeholder="A" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "options", on, "optionText"]}
                            rules={[{ required: true }]}
                            style={{ flex: 1, marginBottom: 0 }}
                          >
                            <Input placeholder="Nội dung đáp án" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "options", on, "isCorrect"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select
                              style={{ width: 100 }}
                              options={[
                                { value: true, label: "Đúng" },
                                { value: false, label: "Sai" },
                              ]}
                            />
                          </Form.Item>
                          <Button type="link" danger size="small" onClick={() => removeOpt(on)}>
                            Xóa
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() =>
                          addOpt({
                            label: String.fromCharCode(65 + optFields.length),
                            optionText: "",
                            isCorrect: false,
                          })
                        }
                        block
                      >
                        + Thêm đáp án
                      </Button>
                    </>
                  )}
                </Form.List>
                <Button type="link" danger size="small" onClick={() => remove(name)} style={{ marginTop: 8 }}>
                  Xóa câu hỏi
                </Button>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() =>
                add({
                  questionText: "",
                  hintText: "",
                  orderIndex: fields.length,
                  options: [
                    { label: "A", optionText: "", isCorrect: false },
                    { label: "B", optionText: "", isCorrect: false },
                  ],
                })
              }
              block
            >
              + Thêm câu hỏi
            </Button>
          </>
        )}
      </Form.List>
      <Form.Item style={{ marginTop: 24 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={saving}>
            Lưu
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
