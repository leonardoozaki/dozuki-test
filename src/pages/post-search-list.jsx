import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Alert, Button, Col, Container, Form, Modal, Row, Stack, Table } from "react-bootstrap";
import PostComments from "./post-comments";


const PostSearchList = (props) =>{

    const { isLoading, isSuccess, isError, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: async () =>{
            var response = await axios.get("https://jsonplaceholder.typicode.com/posts");
            // console.log(JSON.stringify(response))
            return response.data;
        },
      })
    
    const users  = useQuery({
        queryKey: ['repoUser'],
        queryFn: async () =>{
            var response = await axios.get("https://jsonplaceholder.typicode.com/users");
            console.log(JSON.stringify(response))
            return response.data;
        },
    })
    
    const [showErr, setShowErr] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [searchParameter, setSearchParameter] = useState("")
    const [userId, setUserId] = useState("")

    const [currentPost, setCurrentPost] = useState(null)


    function updateSearchParameter(e){
        let value = e.target.value;
        setSearchParameter(value);
    }

    function search(){
        if(searchParameter == ""){
            setUserId("")
            return
        }
        var user = findUser(searchParameter)
        if(user == null){
            setUserId(-1)
        }else{
            setUserId(user.id)
        }

    }

    function findUser(userName){
        return users.data.find(user => user.username == userName)
    }

    function hideFormModal(){
        setShowForm(false);
    }

    function openComments(post){
        setCurrentPost(post);
        setShowForm(true);

    }

    let body = data?.filter(post => userId == "" || post.userId == userId).map(post=>{
        return (
            <tr key={post.id} onClick={()=>openComments(post)}>
                <td>{post.title}</td>
                <td>{post.body}</td>
            </tr>
        )
    });

    return (
        <Stack>
                <Alert show={showErr} variant="danger" onClose={() => this.updateShowErr(false)} dismissible>
                    <p>
                    {errorMessage}
                    </p>
                </Alert>
                <Container>
                    <Row className="button-row">
                        <Col className="align-middle">
                            <h2>
                                Posts
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="align-middle" xs={10}>
                            <Form.Control
                                value={searchParameter} 
                                onChange={updateSearchParameter}
                            />
                        </Col>
                        <Col className="align-middle" xs={2}>
                            <Button variant="secondary" className="align-middle" onClick={search}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                    <Row className="row-margin button-row">
                        <Col>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Body</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { body }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
                <Modal show={showForm} onHide={hideFormModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{currentPost?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PostComments post={currentPost}/>
                    </Modal.Body>
                </Modal>
            </Stack>
    );
}

export default function(props) {
    const queryClient = new QueryClient()

    return(
        <QueryClientProvider client={queryClient}>
            <PostSearchList />
        </QueryClientProvider>
    );
}