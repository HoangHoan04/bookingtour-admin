import BaseView from "@/components/ui/BaseView";
import GlobalLoading from "@/components/ui/Loading";
import { useBlogDetail } from "@/hooks/blog";
import { Card } from "primereact/card";
import { useParams } from "react-router-dom";

export default function DetailBlogPage() {
  const { id } = useParams();
  const { data: blog, isLoading } = useBlogDetail(id);

  if (isLoading) {
    return <GlobalLoading />;
  }

  if (!blog) {
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy bài viết</p>
        </Card>
      </BaseView>
    );
  }

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="grid">
      <div className="col-12 md:col-3">
        <strong>{label}:</strong>
      </div>
      <div className="col-12 md:col-9">{value || "-"}</div>
    </div>
  );

  return <BaseView></BaseView>;
}
