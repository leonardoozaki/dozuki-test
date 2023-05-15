import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Col, Container, Row, Stack, Table } from "react-bootstrap";


const PostComments = (props) =>{

    const {post} = props;

    const { data }  = useQuery({
        queryKey: ['repoComments'],
        queryFn: async () =>{
            var response = await axios.get("https://jsonplaceholder.typicode.com/posts/"+post.id+"/comments");
            console.log(JSON.stringify(response))
            return response.data;
        },
    })

    let body = data?.map(comment=>{
        return (
            <tr key={comment.id} onClick={()=>this.openComments(post)}>
                <td>{comment.name}</td>
                <td>{comment.email}</td>
                <td>{comment.body}</td>
            </tr>
        )
    });

    return (
        <Stack>
            <Container>
                <Row>
                    <Col className="align-middle">
                        <h4>
                            {post.body}
                        </h4>
                    </Col>
                </Row>
                <Row className="row-margin button-row">
                        <Col>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
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
        </Stack>
    );

}

export default function(props) {
    const queryClient = new QueryClient()

    return(
        <QueryClientProvider client={queryClient}>
            <PostComments {...props}/>
        </QueryClientProvider>
    );
}