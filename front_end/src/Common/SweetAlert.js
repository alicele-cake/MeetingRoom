import Swal_ from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const swal = Swal_.mixin({
  confirmButtonText: "確定",
  cancelButtonText: "取消",
  confirmButtonColor: "#1f6650",
  cancelButtonColor: "#aaaaaa",
  allowOutsideClick: false,
});

export default swal;
