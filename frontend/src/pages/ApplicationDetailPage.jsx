import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ApplicationDetailModal from "../components/ui/ApplicationDetailModal";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <ApplicationDetailModal
        applicationId={id}
        isOpen
        page
        onClose={() => navigate("/")}
      />
    </>
  );
}
