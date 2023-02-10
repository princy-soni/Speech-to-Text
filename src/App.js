import "./App.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MicCircleOutline } from "react-ionicons";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { transcript, resetTranscript } = useSpeechRecognition({
    continuous: true,
  });
  const [hindi, setHindi] = useState("");
  const [english, setEnglish] = useState("");
  const [record, setRecord] = useState(false);
  useEffect(() => {
    setEnglish(transcript);
  }, [transcript]);

  const Recording = () => {
    SpeechRecognition.startListening();
    setRecord(true);
  };
  const Stop = () => {
    SpeechRecognition.stopListening();
    setRecord(false);
  };
  const translate = () => {
    setRecord(false);
    if (transcript !== "") {
      setHindi("Translating.......");
      let url = `https://api.mymemory.translated.net/get?q=${transcript}&langpair=${"en"}|${"hi"}`;
      axios.post(url).then((data) => {
        setHindi(data.data.responseData.translatedText);
      });
    } else {
      toast.error("Say Something!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const Reset = () => {
    setHindi("");
    setEnglish("");
    resetTranscript();
    setRecord(false);
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <h1 className="Header">Speech To Text</h1>
        </Row>
        <Row>
          <Card>
            <Container className="Language">
              <Row>
                <Col>
                  <Row>
                    <h3>English</h3>
                  </Row>
                  <Row>
                    <div className="Text">{english}</div>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <h3>Hindi</h3>
                  </Row>
                  <Row>
                    <div className="Text">{hindi}</div>
                  </Row>
                </Col>
              </Row>
            </Container>
            <Card.Body>
              <ButtonGroup className="me-2" aria-label="First group">
                <Button variant="outline-success" onClick={Recording}>
                  {record && (
                    <MicCircleOutline
                      color={"red"}
                      // title={}
                      height="20px"
                      width="20px"
                      beat
                    />
                  )}
                  Start Listening
                </Button>{" "}
                <Button variant="outline-danger" onClick={Stop}>
                  Stop Listening
                </Button>{" "}
                <Button variant="outline-warning" onClick={Reset}>
                  Reset
                </Button>{" "}
                <Button variant="outline-primary" onClick={translate}>
                  Translate
                </Button>{" "}
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
}

export default App;
