import { Form, Button, Card, Container } from "react-bootstrap";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isFormValid =
        email.trim() &&
        password.trim() &&
        confirmPassword.trim() &&
        password === confirmPassword;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            console.log("User has successfully signed up");
            console.log(response.user);

        }
        catch (err) {
            console.log(err.message);
        }



    }




    return (
        <Container
            className="d-flex justify-content-center align-items-center vh-100 bg-dark"
        >
            <Card className="mx-auto mt-5 shadow" style={{ width: "400px" }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Sign Up</h3>

                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </Form.Group>
                        <Button className="mt-4" type="submit" disabled={!isFormValid}>Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>

    )

}
export default Signup;