import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

export default function About() {
    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Twitter Toplinks
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    href="/api/v1/auth/twitter"
                >
                    Login With Twitter
                </Button>
            </Box>
        </Container>
    );
}
