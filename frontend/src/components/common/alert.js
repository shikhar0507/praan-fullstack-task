
import { Alert } from 'flowbite-react';

export default function AppAlert(props) {
  console.log(props.config)
  return (
    <Alert color={props.config.type}>
      <span>
        <p>
          <span className="font-medium">
            {props.config.label}!
          </span>
           &nbsp;&nbsp;{props.config.message}
        </p>
      </span>
    </Alert>
  )
}