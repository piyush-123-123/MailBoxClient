import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Navbar,
    Button,
    Card,
    ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";


const Home = () => {
    const [mails, setMails] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);
    const unreadCount = mails.filter((mail) => !mail.isRead).length;


    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            if (!user) {
                setMails([]);
                return;
            }

            const userId = user.email.replace(/[.#$/[\]]/g, "_");


            try {
                const response = await fetch(
                    `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/inbox.json`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch mails");
                }

                const data = await response.json();

                if (!data) {
                    setMails([]);
                    return;
                }

                const loadedMails = [];

                for (const key in data) {
                    loadedMails.push({
                        id: key,
                        ...data[key],
                    });
                }

                setMails(loadedMails);
            } catch (err) {
                console.log(err.message);
            }
        });

        return () => unsubscribe();
    }, []);
   const openMailHandler = async (mail) => {
  setSelectedMail(mail);

  const userId = auth.currentUser.email.replace(/[.#$/[\]]/g, "_");

  await fetch(
    `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/inbox/${mail.id}.json`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isRead: true,
      }),
    }
  );
  setMails((prevMails) =>
  prevMails.map((item) =>
    item.id === mail.id
      ? { ...item, isRead: true }
      : item
  )
);
};

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
                            📥 Inbox ({unreadCount})
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

                        {selectedMail ? (
                            <Card className="p-3">
                                <Button
                                    variant="secondary"
                                    className="mb-3"
                                    onClick={() => setSelectedMail(null)}
                                >
                                    ← Back
                                </Button>

                                <h3>{selectedMail.subject}</h3>

                                <p>
                                    <strong>From:</strong> {selectedMail.from}
                                </p>

                                <hr />

                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: selectedMail.message,
                                    }}
                                />
                            </Card>
                        ) : (
                            mails.length === 0 ? (
                                <p>No mails found.</p>
                            ) : (
                                mails.map((mail) => (
                                    <Card
                                        key={mail.id}
                                        className="mb-3 p-3"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => openMailHandler(mail)}
                                    >
                                        <h5>
                                            {!mail.isRead && (
                                                <span
                                                    style={{
                                                        color: "blue",
                                                        fontSize: "12px",
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    ●
                                                </span>
                                            )}
                                            {mail.subject}
                                        </h5>

                                        <p>
                                            <strong>From:</strong> {mail.from}
                                        </p>
                                    </Card>
                                ))
                            )
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;