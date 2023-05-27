import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { doc } from "firebase/firestore";
import { getFirestore, collection, setDoc } from "firebase/firestore";
const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useUserAuth();
  let navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Sign up the user
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      const setBalance = doc(db, user.uid,"balance");
      const setIncome = doc(db, user.uid, 'income');
      const setBcatIncome = doc(db, `${user.uid}/income/categories`, 'business');
      const setIcatIncome = doc(db, `${user.uid}/income/categories`, 'investment-returns');
      const setScatIncIncome = doc(db, `${user.uid}/income/categories`, 'incoming-transfer');
      const setOcatIncome = doc(db, `${user.uid}/income/categories`, 'others');
      const setScatIncome = doc(db, `${user.uid}/income/categories`, 'salary');


      const setExpense = doc(db, user.uid, 'expense');
      const setFExpense = doc(db, `${user.uid}/expense/categories`, 'food');
      const setOExpense = doc(db, `${user.uid}/expense/categories`, 'others');
      const setRExpense = doc(db, `${user.uid}/expense/categories`, 'rent');
      const setSExpense = doc(db, `${user.uid}/expense/categories`, 'shopping');
      const setTExpense = doc(db, `${user.uid}/expense/categories`, 'travel');

      const setBudget = doc(db, user.uid, 'budget');

      setDoc(setBalance,{total:"0"}, { capital: true }, { merge: true });
      setDoc(setIncome,{total:"0"}, { capital: true }, { merge: true });
      setDoc(setBcatIncome, { capital: true }, { merge: true });
      setDoc(setIcatIncome, { capital: true }, { merge: true });
      setDoc(setOcatIncome, { capital: true }, { merge: true });
      setDoc(setScatIncIncome, { capital: true }, { merge: true });
      setDoc(setScatIncome, { capital: true }, { merge: true });


      setDoc(setExpense,{total:"0"}, { capital: true }, { merge: true });
      setDoc(setFExpense, { capital: true }, { merge: true });
      setDoc(setOExpense, { capital: true }, { merge: true });
      setDoc(setRExpense, { capital: true }, { merge: true });
      setDoc(setSExpense, { capital: true }, { merge: true });
      setDoc(setTExpense, { capital: true }, { merge: true });

      setDoc(setBudget,{total:"0"}, { capital: true }, { merge: true });



      // Define the document reference and data for the new user document
      const docRef = doc(db, "users", user.uid);
      const data = {
        // Add the necessary fields for the new user document
        // For example, you can include a username field
        username: username,
      };

      // Add the document to the "users" collection
      await setDoc(docRef, data);

      console.log("Document has been added successfully");

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">Firebase Auth Signup</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Control
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Sign up
            </Button>
          </div>
        </Form>
      </div>
      <div className="p-4 box mt-3 text-center">
        Already have an account? <Link to="/">Log In</Link>
      </div>
    </>
  );
};


export default Signup;
