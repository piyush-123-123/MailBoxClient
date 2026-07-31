import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const submitHandler = (e) => {
    e.preventDefault();

    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Message:", editor?.getHTML());
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
    onClick={() => editor.chain().focus().toggleBulletList().run()}
  >
    Bullet List
  </Button>
</div>
            <Card className="p-2">
                
              <EditorContent editor={editor} />
            </Card>
          </Form.Group>

          <Button type="submit">
            Send
          </Button>

        </Form>

      </Card>
    </Container>
  );
};

export default ComposeMail;