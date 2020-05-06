import '../App.css';    
import React , {} from 'react';
import {Card,CardTitle,CardBody} from 'reactstrap'


function ErrorPage() {

    return (
        <div className = "box">
            <div className = "wrapper" >
                 <Card body outline color="secondary" className = "card-error"  >
                <CardTitle><h3>Error</h3> </CardTitle>
                
                <CardBody className = "card-body text-center">
                <p> 
                You got here by mistake, please be sure you are logged in.
                </p>
                <p> 
                    <a href="/"> Go to main page</a>
                </p>

                </CardBody>
            </Card> 
          </div>
        </div>
    )
}
export default ErrorPage