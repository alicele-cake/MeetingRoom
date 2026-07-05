/**
 * 本地儲存服務 - 統一管理瀏覽器儲存操作
 */

// 預設儲存位置
const defaultStorage = localStorage;

/**
 * 安全地設置儲存項目
 * @param {string} key 儲存的鍵名
 * @param {any} value 要儲存的值
 * @param {boolean} isJson 是否為JSON對象（需序列化）
 * @param {Storage} storage 儲存位置，預設使用 localStorage
 * @returns {boolean} 操作是否成功
 */
export const setStorageItem = (
  key,
  value,
  isJson = true,
  storage = defaultStorage
) => {
  try {
    const storedValue = isJson ? JSON.stringify(value) : value;
    storage.setItem(key, storedValue);
    return true;
  } catch (error) {
    console.error(`設置儲存項目失敗 [${key}]:`, error);
    return false;
  }
};

/**
 * 安全地獲取儲存項目
 * @param {string} key 儲存的鍵名
 * @param {boolean} isJson 是否為JSON對象（需反序列化）
 * @param {any} defaultValue 如果獲取失敗時的默認值
 * @param {Storage} storage 儲存位置，預設使用 localStorage
 * @returns {any} 獲取的值或默認值
 */
export const getStorageItem = (
  key,
  isJson = true,
  defaultValue = null,
  storage = defaultStorage
) => {
  try {
    const value = storage.getItem(key);
    if (value === null) return defaultValue;
    // 只嘗試解析一次
    if (isJson) {
      try {
        return JSON.parse(value);
      } catch (parseError) {
        console.warn(`值無法解析為JSON [${key}]:`, parseError);
        return value; // 如果無法解析，返回原始字串
      }
    } else {
      return value;
    }
  } catch (error) {
    console.error(`獲取儲存項目失敗 [${key}]:`, error);
    return defaultValue;
  }
};

/**
 * 安全地移除儲存項目
 * @param {string} key 要移除的鍵名
 * @param {Storage} storage 儲存位置，預設使用 localStorage
 * @returns {boolean} 操作是否成功
 */
export const removeStorageItem = (key, storage = defaultStorage) => {
  try {
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`移除儲存項目失敗 [${key}]:`, error);
    return false;
  }
};

/**
 * 安全地清空所有儲存項目
 * @param {Storage} storage 儲存位置，預設使用 localStorage
 * @returns {boolean} 操作是否成功
 */
export const clearStorage = (storage = defaultStorage) => {
  try {
    storage.clear();
    return true;
  } catch (error) {
    console.error("清空儲存失敗:", error);
    return false;
  }
};

/**
 * 獲取授權 Token
 * @param {Storage} storage 儲存位置，預設使用 localStorage
 * @returns {string|null} Bearer Token 或 null（若不存在）
 */
export const getAuthToken = (storage = defaultStorage) => {
  try {
    const token = getStorageItem("key", true, null, storage);
    if (!token || !token.accessToken) {
      return null;
    }
    return `Bearer ${token.accessToken}`;
  } catch (error) {
    console.error("獲取授權 Token 失敗:", error);
    return null;
  }
};
