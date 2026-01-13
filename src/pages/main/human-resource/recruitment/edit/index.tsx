import GlobalLoading from "@/components/ui/Loading";
import AddRecruitmentPage from "../add";

function EditRecruitmentPage() {
  // const { id } = useParams();
  const handleUpdate = () => {};
  const isLoading = false;

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddRecruitmentPage
          isEdit={true}
          isLoadingUpdate={false}
          title="Chỉnh sửa nhân viên"
          initData={{}}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditRecruitmentPage;
