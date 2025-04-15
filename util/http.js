import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentMonthYear } from "./date";

const BACKEND_URL =
  "https://quanlychitieuapp-f9526-default-rtdb.firebaseio.com";

const API_KEY = "AIzaSyCoRmYnDnHXOhKfT1_p4M1rpfH9kWt8Hps";

const GEMINI_API_KEY = "AIzaSyA5OwpXqow_NanA_u2YO6CNvktmXX2ppSE";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

//Thêm lương tháng
export async function storeMonthlySalary(token, salary, savingsGoal, uid) {
  console.log("storeMonthlySalary - UID:", uid);

  const { year, month } = getCurrentMonthYear();

  await axios.patch(
    `${BACKEND_URL}/monthlySalary/${uid}/${year}/${month}.json?auth=${token}`,
    {
      salary,
      savingsGoal,
    }
  );
}

//Lấy thông tin lương tháng
export async function fetchMonthlySalary(token, uid, year, month) {
  console.log("fetchMonthlySalary - UID:", uid, "Year:", year, "Month:", month);

  let targetYear = year;
  let targetMonth = month;
  let salaryData = null;

  while (targetYear >= 2020) {
    const response = await axios.get(
      `${BACKEND_URL}/monthlySalary/${uid}/${targetYear}/${targetMonth}.json?auth=${token}`
    );

    if (response.data) {
      salaryData = response.data;
      break;
    }
    targetMonth--;
    if (targetMonth === 0) {
      targetMonth = 12;
      targetYear--;
    }
  }

  return {
    salary: salaryData?.salary || 0,
    savingsGoal: salaryData?.savingsGoal || 0,
  };
}

//Cập nhật lương và mục tiêu tiết kiệm của tháng hiện tại và coppy sang tháng tiếp theo nếu chưa có
export async function updateMonthlySalary(
  token,
  salary,
  savingsGoal,
  uid,
  year,
  month
) {
  console.log(
    "updateMonthlySalary - UID:",
    uid,
    "Year:",
    year,
    "Month:",
    month
  );

  // Cập nhật lương và mục tiêu tiết kiệm cho tháng được chỉ định
  await axios.patch(
    `${BACKEND_URL}/monthlySalary/${uid}/${year}/${month}.json?auth=${token}`,
    {
      salary,
      savingsGoal,
    }
  );
}

//Thêm chi tiêu
export async function storeExpense(expenseData, token, uid) {
  console.log("storeExpense - UID:", uid);
  const response = await axios.post(
    `${BACKEND_URL}/expenses/${uid}.json?auth=${token}`,
    expenseData
  );
  const id = response.data.name;
  return id;
}

//Lấy thông tin các chi tiêu
export async function fetchExpenses(token, uid) {
  console.log("fetchExpenses - UID:", uid);
  const response = await axios.get(
    `${BACKEND_URL}/expenses/${uid}.json?auth=${token}`
  );

  const expenses = [];
  if (response.data) {
    for (const key in response.data) {
      const expenseObj = {
        id: key,
        amount: response.data[key].amount,
        date: new Date(response.data[key].date),
        description: response.data[key].description,
        category: response.data[key].category || "Others",
      };
      expenses.push(expenseObj);
    }
  }
  return expenses;
}

//Sửa
export async function updateExpense(id, expenseData, token, uid) {
  console.log("updateExpense - UID:", uid);
  return axios.put(
    `${BACKEND_URL}/expenses/${uid}/${id}.json?auth=${token}`,
    expenseData
  );
}

//Xóa
export async function deleteExpense(id, token, uid) {
  console.log("deleteExpense - UID:", uid);
  return axios.delete(
    `${BACKEND_URL}/expenses/${uid}/${id}.json?auth=${token}`
  );
}

//Xác thực và xử lý đăng ký/đăng nhập
export async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
  const token = response.data.idToken;
  const uid = response.data.localId;

  console.log("(http)authenticate - UID:", uid, "Email:", email);

  if (mode === "signUp") {
    await sendEmailVerification(token);
    console.log("Verification email sent to:", email);
  }

  if (mode === "signInWithPassword") {
    const user = await getUserInfo(token);
    if (!user.emailVerified) {
      throw new Error("Please verify your email.");
    }
  }

  return { token, uid };
}

//Đăng ký
export function createAccount(email, password) {
  return authenticate("signUp", email, password);
}

//Đăng nhập
export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}

//Gửi email xác thực
async function sendEmailVerification(idToken) {
  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;
    await axios.post(url, {
      idToken: idToken,
      requestType: "VERIFY_EMAIL",
    });
  } catch (error) {
    console.error(
      "Error sending email verification:",
      error.response?.data?.error?.message
    );
    throw error;
  }
}

//Lấy thông tin người dùng
async function getUserInfo(idToken) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`;
  const response = await axios.post(url, {
    idToken: idToken,
  });
  return response.data.users[0];
}

//Thay đổi mật khẩu
export async function changePassword(idToken, newPassword) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;
  await axios.post(url, {
    idToken: idToken,
    password: newPassword,
    returnSecureToken: false,
  });
}

//Kiểm tra tồn tại email
export async function checkEmailExists(email) {
  try {
    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email: email,
        password: "randomWrongPassword",
        returnSecureToken: true,
      }
    );
    return true;
  } catch (error) {
    return error.response?.data?.error?.message !== "EMAIL_NOT_FOUND";
  }
}

//Quên mật khẩu
export async function resetPassword(email) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;

  try {
    await axios.post(url, { requestType: "PASSWORD_RESET", email: email });
  } catch (error) {
    console.log("resetPassword Error:", error.response?.data?.error?.message);
    throw error;
  }
}

//Xác thực lại người dùng và mật khẩu khi đổi thông tin
export async function reauthenticateUser(email, oldPassword) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  try {
    const response = await axios.post(url, {
      email: email,
      password: oldPassword,
      returnSecureToken: true,
    });
    return response.data.idToken;
  } catch (error) {
    console.error(
      "Re-authentication failed:",
      error.response?.data?.error?.message
    );
    return null;
  }
}

//Chat bot gemini
export async function support(prompt) {
  try {
    const instruction =
      "Chỉ trả lời về những vấn đề liên quan đến chi tiêu và tiết kiệm, bao gồm giá cả hàng hóa, dịch vụ, vé tham quan, và các cách tiết kiệm tiền. Nếu câu hỏi không liên quan, hãy từ chối. | Only respond to questions related to spending and saving, including the prices of goods, services, tickets, and ways to save money. If the question is unrelated, please refuse.";
    const fullPrompt = `${instruction} Câu hỏi của người dùng | User's question: ${prompt}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return "Your assistant is not available. Please try again later!";
  }
}

//Thêm SĐT người dùng
export async function storePhoneNumber(token, phoneNumber, uid) {
  console.log("storePhoneNumber - UID:", uid);

  await axios.patch(`${BACKEND_URL}/phoneNumbers/${uid}.json?auth=${token}`, {
    phoneNumber,
  });
}
