import { useParams } from "react-router-dom";
import { useRef } from "react";
import { PrimeIcons } from "primereact/api";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import BaseView from "@/components/ui/BaseView";
import Title from "@/components/ui/Title";
import ActionLog from "@/components/ui/ActionLog";
import RowActions, { type ActionButton } from "@/components/ui/RowAction";
import StatusTag from "@/components/ui/StatusTag";
import ActionConfirm, {
  type ActionConfirmRef,
} from "@/components/ui/ActionConfirm";
import {
  useBlogDetail,
  usePublishBlog,
  useDraftBlog,
  useRejectBlog,
  useArchiveBlog,
} from "@/hooks/blog";
import { useRouter } from "@/routers/hooks";
import { ROUTES } from "@/common/constants/routes";
import { formatDateTime } from "@/common/helpers/format";

export default function DetailBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: blog, isLoading, refetch } = useBlogDetail(id);
  const publishRef = useRef<ActionConfirmRef>(null);
  const draftRef = useRef<ActionConfirmRef>(null);
  const rejectRef = useRef<ActionConfirmRef>(null);
  const archiveRef = useRef<ActionConfirmRef>(null);
  const { onPublishBlog } = usePublishBlog();
  const { onDraftBlog } = useDraftBlog();
  const { onRejectBlog } = useRejectBlog();
  const { onArchiveBlog } = useArchiveBlog();

  if (!blog && !isLoading) return <BaseView>Không tìm thấy bài viết</BaseView>;

  const handleAction = async (fn: Function, ...args: any[]) => {
    await fn(...args);
    await refetch();
  };

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "success";
      case "DRAFT":
        return "info";
      case "REJECTED":
        return "danger";
      case "ARCHIVED":
        return "secondary";
      default:
        return "warning";
    }
  };

  const headerActions: ActionButton[] = [
    {
      key: "back",
      label: "Quay lại",
      icon: PrimeIcons.ARROW_LEFT,
      severity: "secondary",
      onClick: () => router.back(),
    },
    {
      key: "edit",
      label: "Chỉnh sửa",
      icon: PrimeIcons.PENCIL,
      severity: "warning",
      visible: !blog?.isDeleted,
      onClick: () =>
        router.push(
          ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.EDIT_BLOG.path.replace(
            ":id",
            blog?.id || "",
          ),
        ),
    },
    {
      key: "publish",
      label: "Xuất bản",
      icon: PrimeIcons.SEND,
      severity: "success",
      visible: blog?.status !== "PUBLISHED",
      onClick: () => publishRef.current?.show(),
    },
    {
      key: "draft",
      label: "Chuyển nháp",
      icon: PrimeIcons.FILE,
      severity: "info",
      visible: blog?.status !== "DRAFT",
      onClick: () => draftRef.current?.show(),
    },
    {
      key: "archive",
      label: "Lưu trữ",
      icon: PrimeIcons.INBOX,
      severity: "secondary",
      visible: blog?.status !== "ARCHIVED",
      onClick: () => archiveRef.current?.show(),
    },
  ];

  return (
    <BaseView isLoading={isLoading}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Title>Chi tiết bài viết</Title>
            <StatusTag
              severity={getStatusSeverity(blog?.status || "")}
              value={blog?.status}
            />
          </div>
        </div>
        <RowActions actions={headerActions} justify="end" />
      </div>

      <TabView className="mt-2">
        <TabPanel header="Nội dung bài viết" leftIcon="pi pi-file-edit mr-2">
          {blog && <BlogDetailContent data={blog} />}
        </TabPanel>

        <TabPanel header="Lịch sử thao tác" leftIcon="pi pi-history mr-2">
          <ActionLog functionType="Blog" functionId={id} />
        </TabPanel>
      </TabView>

      <ActionConfirm
        ref={publishRef}
        title="Xuất bản"
        message="Đưa bài viết này lên hiển thị công khai?"
        onConfirm={() => handleAction(onPublishBlog, blog?.id)}
      />
      <ActionConfirm
        ref={draftRef}
        title="Chuyển nháp"
        message="Gỡ bài viết xuống và chuyển về trạng thái nháp?"
        onConfirm={() => handleAction(onDraftBlog, blog?.id)}
      />
      <ActionConfirm
        ref={archiveRef}
        title="Lưu trữ"
        message="Xác nhận đưa bài viết này vào kho lưu trữ?"
        onConfirm={() => handleAction(onArchiveBlog, blog?.id)}
      />
      <ActionConfirm
        ref={rejectRef}
        title="Từ chối"
        message="Lý do từ chối bài viết?"
        withReason
        isRequireReason
        onConfirm={(reason) =>
          handleAction(onRejectBlog, { id: blog?.id, reason })
        }
      />
    </BaseView>
  );
}

const BlogDetailContent = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col md:flex-row p-6 gap-8 animate-in fade-in duration-500 bg-[#262626]">
      <div className="flex-1 space-y-6">
        <div className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-10">
            <div className="flex items-center gap-3 mb-6">
              <Tag
                value={data.category}
                severity="info"
                className="text-blue-700 border-blue-100 px-3"
              />
              <div className="flex gap-2">
                {data.tags?.map((t: string) => (
                  <span
                    key={t}
                    className="text-[10px] text-slate-500 px-2 py-1 rounded font-bold"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black  mb-6 leading-tight tracking-tight">
              {data.title}
            </h1>

            <div className="p-5 rounded-lg border-l-3 border-blue-500 mb-8 shadow-inner shadow-amber-50">
              <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">
                Tóm tắt ngắn
              </span>
              <p className="text-slate-700 text-lg italic leading-relaxed m-0">
                "{data.excerpt || "Không có tóm tắt"}"
              </p>
            </div>

            <Divider />

            <div
              className="blog-content-viewer prose prose-slate max-w-none 
              prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-black mb-5 flex items-center gap-2 uppercase tracking-widest">
            <i className="pi pi-search text-blue-500"></i> Thông tin SEO &
            Metadata
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                SEO Title
              </span>
              <span className="text-sm font-semibold">
                {data.seoTitle || "Chưa cấu hình"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Slug
              </span>
              <span className="text-sm text-blue-600 font-mono italic">
                /{data.slug}
              </span>
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                SEO Description
              </span>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                {data.seoDescription || "Chưa cấu hình mô tả SEO"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: SIDEBAR THÔNG TIN (Chiếm 1/3) */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        {/* CARD: STATS & PUBLISH */}
        <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Chỉ số tương tác
          </h4>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl text-center flex flex-col items-center justify-center">
              <p className="text-[10px] text-blue-400 font-bold uppercase mt-1 flex items-center gap-2">
                <i className="pi pi-eye text-blue-500"></i>
                Lượt xem
              </p>
              <span className="text-2xl font-black text-blue-700">
                {data.viewCount || 0}
              </span>
            </div>
            <div className="bg-rose-50 p-4 rounded-xl text-center flex flex-col items-center justify-center">
              <p className="text-[10px] text-rose-400 font-bold uppercase mt-1 flex items-center gap-2">
                <i className="pi pi-heart-fill text-rose-500"></i>
                Yêu thích
              </p>
              <span className="text-2xl font-black text-rose-700">
                {data.likeCount || 0}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100 mt-4">
            <SidebarItem
              label="Tác giả"
              value={data.author?.username}
              icon="pi-user"
            />
            <SidebarItem
              label="Xuất bản lúc"
              value={formatDateTime(data.publishedAt)}
              icon="pi-send"
            />
            <SidebarItem
              label="Cập nhật cuối"
              value={formatDateTime(data.updatedAt)}
              icon="pi-sync"
            />
          </div>
        </div>

        {/* CARD: TÁC GIẢ (DARK MODE STYLE) */}
        <div className="rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            Thông tin tác giả
          </h4>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-full bg-linear-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-xl font-black shadow-lg">
              {data.author?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">
                {data.author?.username || "Admin"}
              </span>
              <span className="text-xs text-slate-400">
                {data.author?.email}
              </span>
              <div className="mt-2">
                {data.author?.isAdmin && (
                  <Tag
                    value="Administrator"
                    severity="danger"
                    className="text-[9px] h-auto py-0 px-2"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* THỜI GIAN HỆ THỐNG */}
        <div className="px-4 py-2 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 font-medium italic">
            Bài viết được tạo vào: {formatDateTime(data.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ label, value, icon }: any) => (
  <div className="flex justify-between items-center group">
    <div className="flex items-center gap-2 hover:text-blue-500 rounded-lg">
      <div className="w-6 h-6 rounded flex items-center justify-center">
        <i
          className={`pi ${icon} text-[10px] text-slate-500 group-hover:text-blue-500`}
        ></i>
      </div>
      <span className="text-xs text-slate-500 font-medium hover:text-blue-500">
        {label}
      </span>
    </div>
    <span className="text-xs font-bold">{value || "---"}</span>
  </div>
);
