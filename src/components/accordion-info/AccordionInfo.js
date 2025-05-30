import Accordion from 'react-bootstrap/Accordion';

export default function AccordionInfo() {
    return (
        <Accordion defaultActiveKey={['0']} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header> Test Deployment #1 – Your Feedback is Crucial!</Accordion.Header>
            <Accordion.Body>
           Hello everyone,

We're excited to announce that Test Deployment #1 of our web app is now live! This is a significant step forward, and your input is invaluable in making this project a success.

Encountered a Bug or Error?
If you come across any bugs or errors, please don't hesitate to report them. Your observations are crucial in helping us refine and enhance the app's performance.

Got Ideas? We're All Ears!
Your ideas and suggestions can make a big difference. If there's anything you think could improve the app – a feature you'd like to see, a user experience enhancement, or any other feedback – we're eager to hear from you.

Let's Connect!
Feel free to reach out to me directly at <strong>m.erdene404@gmail.com</strong>. Every piece of feedback, big or small, is immensely appreciated.

Thank you for your support and contribution to making our web app better. We can't wait to hear your thoughts!

Best regards, <a href="https://www.mikeportfolio.click/"><strong>Mike Erdene</strong></a>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Accordion Item #2</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      );
}
