const axios = require("axios");



const BACKEND_URL = "http://45.76.251.232:3031"; // Replace with your actual backend URL
let jwt;

function testSignUp() {
  console.log("Running testSignUp");
  const data = {
    username: "testuser",
    password: "Test1379@",
    email: "test123@gmail.com",
    confirmPassword: "Test1379@",
  };
  axios.post(BACKEND_URL + "/signup", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        jwt = res.data.token;
        testSetIncome();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testSetIncome() {
  console.log("Running testSetIncome");
  const data = {
    token: jwt,
    income: 1234,
  };
  axios.post(BACKEND_URL + "/api/update_income", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        testSetSavings();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testSetSavings() {
  console.log("Running testSetSavings");
  const data = {
    token: jwt,
    savings: 12345,
  };
  axios.post(BACKEND_URL + "/api/update_savings", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        testAddToBudget1();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testAddToBudget1() {
  console.log("Running testAddToBudget1");
  const data = {
    token: jwt,
    title: "Test Budget 1",
    budget: 234,
    color: "#123",
  };
  axios.post(BACKEND_URL + "/api/add_budget", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        testAddToBudget2();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testAddToBudget2() {
  console.log("Running testAddToBudget2");
  const data = {
    token: jwt,
    title: "Test Budget 2",
    budget: 345,
    color: "#234567",
  };
  axios.post(BACKEND_URL + "/api/add_budget", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        testSignOutAll();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testSignOutAll() {
  console.log("Running testSignOutAll");
  const data = {
    token: jwt,
  };
  axios.post(BACKEND_URL + "/api/sign_out_all", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        testLogin1();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testLogin1() {
  console.log("Running testLogin1");
  const data = {
    username: "testuser",
    password: "Test1379@",
  };
  axios.post(BACKEND_URL + "/login", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        jwt = res.data.token;
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testChangePassword() {
  console.log("Running testChangePassword");
  const data = {
    token: jwt,
    newPassword: "NewPassword1234",
  };
  axios.post(BACKEND_URL + "/api/change_password", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        testLogin2();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testLogin2() {
  console.log("Running testLogin2");
  const data = {
    username: "testuser",
    password: "NewPassword1234",
  };
  axios.post(BACKEND_URL + "/login", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        jwt = res.data.token;
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testGetBudget1() {
  console.log("Running testGetBudget1");
  const data = {
    token: jwt,
  };
  axios.post(BACKEND_URL + "/api/get_budget", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        console.assert(res.data.income === 1234);
        console.assert(res.data.savings === 12345);
        console.assert(res.data.budgetData.length === 2);
        console.assert(res.data.budgetData[0].budget === 234);
        console.assert(res.data.budgetData[1].budget === 345);
        testDeleteFromBudget();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testDeleteFromBudget() {
  console.log("Running testDeleteFromBudget");
  const data = {
    token: jwt,
    title: "Test Budget 1",
  };
  axios.post(BACKEND_URL + "/api/delete_from_budget", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        testGetBudget2();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testGetBudget2() {
  console.log("Running testGetBudget2");
  const data = {
    token: jwt,
  };
  axios.post(BACKEND_URL + "/api/get_budget", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        console.assert(res.data.income === 1234);
        console.assert(res.data.savings === 12345);
        console.assert(res.data.budgetData.length === 1);
        console.assert(res.data.budgetData[0].budget === 345);
        testDeleteAccount();
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}

function testDeleteAccount() {
  console.log("Running testDeleteAccount");
  const data = {
    token: jwt,
  };
  axios.post(BACKEND_URL + "/api/delete_account", data).then((res) => {
    if (res && res.data) {
      if (res.data.ok === 1) {
        console.log("All tests completed successfully!");
      } else {
        console.log(res.data);
      }
    } else {
      console.log(res.data);
    }
  });
}


testLogin1();

