import axios from "axios";

const BACKEND_URL =
  "https://quanlychitieuapp-f9526-default-rtdb.firebaseio.com";

const API_KEY = "AIzaSyCoRmYnDnHXOhKfT1_p4M1rpfH9kWt8Hps";
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
