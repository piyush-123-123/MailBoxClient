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
import { useDispatch, useSelector } from "react-redux";
import { fetchInboxMails, markMailAsRead } from "../store/mailSlice";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { deleteMail } from "../store/mailSlice";


const Home = () => {

    const { mails, loading, error } = useSelector(
        (state) => state.mail
    );

    const [selectedMail, setSelectedMail] = useState(null);
    const [folder, setFolder] = useState("inbox");
    const unreadCount = mails.filter((mail) => !mail.isRead).length;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) return;

            const userId = user.email.replace(/[.#$/[\]]/g, "_");

            dispatch(
  fetchInboxMails({
    userId,
    folder,
  })
);
        });

        return () => unsubscribe();
    }, [dispatch,folder]);


    const deleteMailHandler = (mailId) => {
        const userId = auth.currentUser.email.replace(/[.#$/[\]]/g, "_");

        dispatch(
            deleteMail({
                userId,
                mailId,
                folder
            })
        );

        setSelectedMail(null);
    };

    const openMailHandler = async (mail) => {
        setSelectedMail(mail);

        const userId = auth.currentUser.email.replace(/[.#$/[\]]/g, "_");

        const response = await fetch(
            `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/${folder}/${mail.id}.json`,
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

        if (!response.ok) {
            throw new Error("Failed to update mail");
        }

        dispatch(markMailAsRead(mail.id));


    };
    if (loading) {
        return <h3>Loading...</h3>;
    }

    if (error) {
        return <h3>{error}</h3>;
    }
   const logoutHandler = async () => {
    try {
        await signOut(auth);
        navigate("/login");
    } catch (err) {
        console.log(err.message);
    }
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
                          <Button
        variant="outline-light"
        onClick={logoutHandler}
    >
        Logout
    </Button>
                    </Navbar>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={2}>
                    <ListGroup.Item
                        action
                        active={folder === "inbox"}
                        onClick={() => {
                            setFolder("inbox");
                            setSelectedMail(null);
                        }}
                    >
                        📥 Inbox {folder === "inbox" && `(${unreadCount})`}
                    </ListGroup.Item>

                    <ListGroup.Item
                        action
                        active={folder === "sent"}
                        onClick={() => {
                            setFolder("sent");
                            setSelectedMail(null);
                        }}
                    >
                        📤 Sent
                    </ListGroup.Item>
                </Col>

                <Col md={10}>
                    <div className="p-2">
                        <h4>Inbox</h4>

                        <hr />

                        {selectedMail ? (
                            <Card className="p-3 shadow">
                                <Button
                                    variant="secondary"
                                    className="mb-3"
                                    onClick={() => setSelectedMail(null)}
                                >
                                    ← Back
                                </Button>

                                <h3>{selectedMail.subject}</h3>

                               <p className="text-muted mb-3">
    <strong>{folder === "inbox" ? "From" : "To"}:</strong>{" "}
    {folder === "inbox" ? selectedMail.from : selectedMail.to}
</p>

                                <hr />

                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: selectedMail.message,
                                    }}
                                />

                                <hr />

                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => deleteMailHandler(selectedMail.id)}
                                    >
                                        🗑 Delete
                                    </Button>
                                </div>
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

                                       <p className="mb-0">
    <strong>{folder === "inbox" ? "From" : "To"}:</strong>{" "}
    {folder === "inbox" ? mail.from : mail.to}
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