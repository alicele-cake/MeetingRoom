import axios from "axios";
// import swal from "../Common/SweetAlert";
// import { isEmpty } from "../Common/Function";
// import { getStorageItem } from "./StorageService";


// export const getKey = () => {
//   const token = getStorageItem("key");
//   return "Bearer " + token.accessToken;
// };

export const BASEURL = import.meta.env.VITE_BASEURL;
export const BACKENDVERSION = import.meta.env.VITE_BACKENDVERSION;

export const COMMONREQUEST = (progNo = "", isQuModal = false) => {
  const instance = axios.create({
    baseURL: BASEURL + `/api/api${progNo}/`,
    headers: {
      FromQuModal: isQuModal,
      Authorization: getKey(),
      ACCTYaccessToken: getACCTYaccessToken(),
    },
  });

  addInterceptor(instance);
  return instance;
};


/**
 *
 * @param {string} progNo 程式代碼
 * @param {object} postData
 * @returns
 */
export const doQuOther = (progNo, postData, isQuModal = false) => {
  const url = BASEURL + `/api/api${progNo}/QuOther`;
  const instance = axios.create({
    headers: {
      FromQuModal: isQuModal,
      Authorization: getKey(),
      ACCTYaccessToken: getACCTYaccessToken(),
    },
  });

  addInterceptor(instance);
  return new Promise((resolve, reject) => {
    instance
      .post(url, postData)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};
