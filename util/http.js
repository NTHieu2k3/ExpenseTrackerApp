import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentMonthYear } from "./date";

const BACKEND_URL =
  "https://quanlychitieuapp-f9526-default-rtdb.firebaseio.com";

const API_KEY = "AIzaSyCoRmYnDnHXOhKfT1_p4M1rpfH9kWt8Hps";

const GEMINI_API_KEY = "AIzaSyA5OwpXqow_NanA_u2YO6CNvktmXX2ppSE";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

  await axios.patch(
    `${BACKEND_URL}/monthlySalary/${uid}/${year}/${month}.json?auth=${token}`,
    {
      salary,
      savingsGoal,
    }
  );

  const nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 12) {
    nextYear++;
  }

  const nextMonthData = await fetchMonthlySalary(
    token,
    uid,
    nextYear,
    nextMonth
  );
  if (!nextMonthData.salary && !nextMonthData.savingsGoal) {
    await axios.patch(
      `${BACKEND_URL}/monthlySalary/${uid}/${nextYear}/${nextMonth}.json?auth=${token}`,
      {
        salary,
        savingsGoal,
      }
    );
  }
}

export async function storeExpense(expenseData, token, uid) {
  console.log("storeExpense - UID:", uid);
  const response = await axios.post(
    `${BACKEND_URL}/expenses/${uid}.json?auth=${token}`,
    expenseData
  );
  const id = response.data.name;
  return id;
}

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

export async function updateExpense(id, expenseData, token, uid) {
  console.log("updateExpense - UID:", uid);
  return axios.put(
    `${BACKEND_URL}/expenses/${uid}/${id}.json?auth=${token}`,
    expenseData
  );
}

export async function deleteExpense(id, token, uid) {
  console.log("deleteExpense - UID:", uid);
  return axios.delete(
    `${BACKEND_URL}/expenses/${uid}/${id}.json?auth=${token}`
  );
}

export async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
  const token = response.data.idToken;
  const uid = response.data.localId;
  console.log("authenticate - UID:", uid);
  return { token, uid };
}

export function createAccount(email, password) {
  return authenticate("signUp", email, password);
}

export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}

export async function changePassword(idToken, newPassword) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;
  await axios.post(url, {
    idToken: idToken,
    password: newPassword,
    returnSecureToken: false,
  });
}

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

export async function resetPassword(email) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;

  try {
    await axios.post(url, { requestType: "PASSWORD_RESET", email: email });
  } catch (error) {
    console.log("resetPassword Error:", error.response?.data?.error?.message);
    throw error;
  }
}

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

export async function support(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return "Your assistant is not available. Please try again late !  ";
  }
}
