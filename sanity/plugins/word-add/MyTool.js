import React from 'react'
import {Text, Stack, Container, Card ,Heading} from '@sanity/ui'

const MyTool = () => {
  return <>
    <Container width={3}> 
      <Card margin={3} padding={4}>
        <Stack space={3}>
          <Heading as="h1" size={5}>Nueva palabra</Heading>
        </Stack>
      </Card>
    </Container>
  </>
}

export default MyTool
