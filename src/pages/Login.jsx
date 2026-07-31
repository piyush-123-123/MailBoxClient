import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import signupImage from "../assets/signUp.jpeg";
import { useNavigate, Link } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const isFormValid = email.trim() && password.trim();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password.trim()
            )
            const token = await response.user.getIdToken();
            localStorage.setItem("token", token);
            navigate("/home");
        }

        catch (err) {
            alert(err.message);
        }

    }


    return (
        <Container className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <Card className="shadow" style={{ width: "850px" }}>
                <Row className="g-0">

                    <Col
                        md={6}
                        className="d-flex justify-content-center align-items-center bg-light"
                    >
                        <img
                            src={signupImage}
                            alt="Signup"
                            className="img-fluid"
                            style={{ maxWidth: "350px" }}
                        />
                    </Col>

                    <Col md={6}>
                        <Card.Body>
                            <h3 className="text-center mb-4">Login</h3>

                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            
                                <Button className="w-100 mt-3" type="submit" disabled={!isFormValid}>
                                    Login
                                </Button>
                                    <div className="text-center mt-3">
                                    Don't have an account?{" "}
                                    <Link to="/signup">Sign Up</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Col>

                </Row>
            </Card>
        </Container>

    )

}
export default Login