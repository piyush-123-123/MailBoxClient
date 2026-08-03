import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { auth } from "../firebase";
import useApi from "../hooks/useApi";


const ComposeMail = () => {

    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const { sendRequest, loading, error } = useApi();

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
    });

    const submitHandler = async (e) => {

        e.preventDefault();

        const senderEmail = auth.currentUser.email;
        const mailData = {
            from: senderEmail,
            to: to.trim(),
            subject: subject.trim(),
            message: editor.getHTML(),
            isRead: false
        };
        const senderId = senderEmail.replace(/[.#$/[\]]/g, "_");
        const receiverId = to.trim().replace(/[.#$/[\]]/g, "_");
        try {
            await sendRequest({
                url: `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${senderId}/sent.json`,
                method: "POST",
                body: mailData,
            });

            await sendRequest({
                url: `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${receiverId}/inbox.json`,
                method: "POST",
                body: mailData,
            });
            alert("Mail sent successfully!");
        }
        catch (err) {
            console.log(err.message);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow">

                <h3 className="mb-4">Compose Mail</h3>

                <Form onSubmit={submitHandler}>

                    <Form.Group className="mb-3">
                        <Form.Label>To</Form.Label>

                        <Form.Control
                            type="email"
                            placeholder="Enter receiver email"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Subject</Form.Label>

                        <Form.Control
                            type="text"
                            placeholder="Enter subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Message</Form.Label>
                        <div className="mb-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="me-2"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                            >
                                Bold
                            </Button>

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="me-2"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                            >
                                Italic
                            </Button>

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="me-2"
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                            >
                                Bullet List
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="me-2"
                                disabled={!editor}
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            >
                                Numbered List
                            </Button>

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={!editor}
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                                }
                            >
                                Heading
                            </Button>
                        </div>

                        <Card className="p-2">

                            <EditorContent editor={editor} />
                        </Card>
                    </Form.Group>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send"}
                    </Button>

                </Form>

            </Card>
        </Container>
    );
};

export default ComposeMail;