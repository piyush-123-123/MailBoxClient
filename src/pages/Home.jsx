import { Container, Row, Col } from "react-bootstrap";
import { Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import {auth} from "../firebase";
import {useState,useEffect} from "react";

const Home = () => {

    const [mails, setMails] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
  const fetchMails = async () => {

    if (!auth.currentUser) {
  return;
}
    const userEmail = auth.currentUser.email;
    const userId = userEmail.replace(/[.#$/[\]]/g, "_");
    const response = await fetch(
  `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/inbox.json`
);
const data = await response.json();

console.log(data);

  };

  fetchMails();
}, []);
    return (
        <Container fluid>

            <Row>
                <Col>
                    <Navbar bg="dark" variant="dark" className="mt-4 px-4">
                        <Navbar.Brand>📧 Mail Box</Navbar.Brand>

                        <Button
                            variant="primary"
                            className="ms-auto"
                            onClick={() => navigate("/composeMail")}
                        >
                            Compose
                        </Button>
                    </Navbar>
                </Col>
            </Row>

            <Row className="mt-3">

                <Col md={2}>
                    <ListGroup variant="flush">

                        <ListGroup.Item action>
                            📥 Inbox
                        </ListGroup.Item>

                        <ListGroup.Item action>
                            📤 Sent
                        </ListGroup.Item>

                    </ListGroup>
                </Col>

                <Col md={10}>
                    <div className="p-2">

                        <h4>Inbox</h4>

                        <hr />

                        <p>No mails found.</p>

                    </div>
                </Col>

            </Row>

        </Container>
    );
};

export default Home;