import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Spacer,
  Text,
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import OrderForm from './components/OrderForm';

const App: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Box as="header" bg="teal.500" color="white" p={4} position="sticky" top={0} zIndex={1}>
        <Container maxW="container.xl">
          <Flex align="center">
            <Heading size="lg">Pizzaria Voors</Heading>
            <Spacer />
            {isMobile ? (
              <IconButton
                aria-label="Open menu"
                icon={<HamburgerIcon />}
                onClick={onOpen}
                variant="outline"
                colorScheme="whiteAlpha"
              />
            ) : (
              <Flex gap={4}>
                <Link href="#home">Home</Link>
                <Link href="#order">Faça seu Pedido</Link>
              </Flex>
            )}
          </Flex>
        </Container>
      </Box>

      {isMobile && (
        <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Pizzaria Voors</DrawerHeader>
            <DrawerBody>
              <Flex direction="column" gap={4}>
                <Link href="#home" onClick={onClose}>Home</Link>
                <Link href="#order" onClick={onClose}>Faça seu Pedido</Link>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      <Box flex="1">
        <Container maxW="container.xl" py={8} id="order">
          <OrderForm />
        </Container>
      </Box>

      <Box as="footer" bg="teal.500" color="white" py={4} textAlign="center">
        <Container maxW="container.xl">
          <Text>&copy; {new Date().getFullYear()} Pizzaria Voors. Todos os direitos reservados.</Text>
        </Container>
      </Box>
    </Box>
  );
};

export default App;
