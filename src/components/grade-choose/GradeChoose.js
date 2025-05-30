import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

export default function GradeChoose() {
  const grades = [
    {
      title: "Pre-K",
      image: "/images/pre-k.png",
      text: "Introductory single-digit addition problems for Pre-K kids, advancing to two-digit numbers",
    },
    {
      title: "Kindergarten",
      image: "/images/kinder.png",
      text: "Beginner single-digit and easy two-digit addition problems for Kindergarten kids.",
    },
    {
      title: "First Grade",
      image: "/images/first.png",
      text: "Single-digit and beginner two-digit addition challenges for First Grade students.",
    },
    {
      title: "Second Grade",
      image: "/images/second.png",
      text: "Two-digit addition problems, introducing more challenging numbers for Second Grade students.",
    },
    {
      title: "Third Grade",
      image: "/images/third.png",
      text: "Complex two-digit and introductory three- and four-digit addition for Third Grade students.",
    },
    {
      title: "Fourth Grade",
      image: "/images/fourth.png",
      text: "Advanced addition problems with multi-digit numbers for Fourth Grade students.",
    },
    // ... add other grade details here
  ];

  const navigate = useNavigate();

  const handleChoose = (gradeTitle) => {
    navigate("/game", { state: { title: gradeTitle } });
  };

  return (
    <Container>
      <Row>
        {grades.map((grade, index) => (
          <Col xs={12} md={6} lg={4} key={index}>
            <Card
              style={{ width: "18rem", marginBottom: "1rem" }}
              onClick={() => handleChoose(grade.title)}
            >
              <Card.Img variant="top" src={grade.image} />
              <Card.Body>
                <Card.Title>{grade.title}</Card.Title>
                <Card.Text>{grade.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
