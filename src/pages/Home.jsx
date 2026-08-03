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
import { onAuthStateChanged, signOut } from "firebase/auth";
import useApi from "../hooks/useApi";

const Home = () => {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [folder, setFolder] = useState("inbox");

  const unreadCount = mails.filter((mail) => !mail.isRead).length;

  const { sendRequest, loading, error } = useApi();

  const navigate = useNavigate();

 const loadMails = (data) => {
  if (!data) {
    setMails([]);
    return;
  }

  const loadedMails = Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));

  setMails(loadedMails);
};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const userId = user.email.replace(/[.#$/[\]]/g, "_");

        const data = await sendRequest({
          url: `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/${folder}.json`,
        });

        loadMails(data);
      } catch (err) {
        console.log(err.message);
      }
    });

    return () => unsubscribe();
  }, [folder,sendRequest]);

  useEffect(() => {
    if (!auth.currentUser || folder !== "inbox") return;

    const userId = auth.currentUser.email.replace(/[.#$/[\]]/g, "_");

    const interval = setInterval(async () => {
      try {
        const data = await sendRequest({
          url: `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/inbox.json`,
        });

        loadMails(data);
      } catch (err) {
        console.log(err.message);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [folder,sendRequest]);

  const openMailHandler = async (mail) => {
    try {
      setSelectedMail(mail);

      const userId = auth.currentUser.email.replace(/[.#$/[\]]/g, "_");

      await sendRequest({
        url: `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/${folder}/${mail.id}.json`,
        method: "PATCH",
        body: {
          isRead: true,
        },
      });

      setMails((prevMails) =>
        prevMails.map((item) =>
          item.id === mail.id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteMailHandler = async (mailId) => {
    try {
      const userId = auth.currentUser.email.replace(/[.#$/[\]]/g, "_");

      await sendRequest({
        url: `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/${folder}/${mailId}.json`,
        method: "DELETE",
      });

      setMails((prevMails) =>
        prevMails.filter((mail) => mail.id !== mailId)
      );

      setSelectedMail(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  if (loading && mails.length === 0) {
    return <h3>Loading...</h3>;
  }

  if (error) {
    return <h3>{error}</h3>;
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <Navbar bg="dark" variant="dark" className="mt-4 px-4">
            <Navbar.Brand>📧 Mail Box</Navbar.Brand>

            <Button
              variant="primary"
              className="ms-auto me-2"
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
          <ListGroup>
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
          </ListGroup>
        </Col>

        <Col md={10}>
          <div className="p-2">
            <h4>{folder === "inbox" ? "Inbox" : "Sent"}</h4>

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
                  {folder === "inbox"
                    ? selectedMail.from
                    : selectedMail.to}
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
            ) : mails.length === 0 ? (
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
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;