import React, { useState } from 'react';
import {
  Button,
  Select,
  Input,
  Box,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Image,
  Text,
  Flex,
  Center,
  Spinner,
  Tag,
  TagLabel,
  TagCloseButton,
  SimpleGrid,
  useToast
} from '@chakra-ui/react';
import { useOrders } from '../hooks/useOrders';
import calabresaIcon from '../assets/flavors/calabresa.svg';
import margueritaIcon from '../assets/flavors/marguerita.svg';
import portuguesaIcon from '../assets/flavors/portuguesa.svg';

const flavorIcons = {
  calabresa: calabresaIcon,
  marguerita: margueritaIcon,
  portuguesa: portuguesaIcon
};

const OrderForm: React.FC = () => {
  const { createOrder, order, loading, error } = useOrders();
  const [pizzas, setPizzas] = useState([{ size: '', flavor: '', customizations: [] }]);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [newCustomization, setNewCustomization] = useState('');
  const toast = useToast();

  const handleAddPizza = () => {
    setPizzas([...pizzas, { size: '', flavor: '', customizations: [] }]);
  };

  const handleRemovePizza = (index: number) => {
    setPizzas(pizzas.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newPizzas = [...pizzas];
    newPizzas[index][field] = value;
    setPizzas(newPizzas);
  };

  const handleFlavorSelect = (index: number, flavor: string) => {
    const newPizzas = [...pizzas];
    newPizzas[index].flavor = flavor;
    setPizzas(newPizzas);
    setSelectedFlavor(flavor);
  };

  const handleAddCustomization = (index: number) => {
    if (newCustomization.trim() === '') return;
    const newPizzas = [...pizzas];
    if (!newPizzas[index].customizations.includes(newCustomization.trim())) {
      newPizzas[index].customizations.push(newCustomization.trim());
      setPizzas(newPizzas);
    }
    setNewCustomization('');
  };

  const handleRemoveCustomization = (index: number, customization: string) => {
    const newPizzas = [...pizzas];
    newPizzas[index].customizations = newPizzas[index].customizations.filter(c => c !== customization);
    setPizzas(newPizzas);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createOrder(pizzas);
      toast({
        title: "Pedido criado com sucesso!",
        description: "Seu pedido foi enviado e está sendo processado.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Erro ao criar pedido.",
        description: "Ocorreu um erro ao tentar criar o seu pedido. Tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center p={4}>
      <Box w="full" maxW="800px">
        <Heading mb={4}>Faça seu pedido</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            {pizzas.map((pizza, index) => (
              <Box key={index} borderWidth={1} borderRadius="md" p={4} shadow="md" bg="white">
                <Flex align="center" justify="space-between">
                  <Heading size="md">Pizza {index + 1}</Heading>
                  <Button colorScheme="red" onClick={() => handleRemovePizza(index)}>
                    Remover Pizza
                  </Button>
                </Flex>
                <FormControl mt={2}>
                  <FormLabel>Tamanho</FormLabel>
                  <Select
                    placeholder="Selecione o tamanho"
                    value={pizza.size}
                    onChange={(e) => handleChange(index, 'size', e.target.value)}
                  >
                    <option value="pequena">Pequena</option>
                    <option value="média">Média</option>
                    <option value="grande">Grande</option>
                  </Select>
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Sabor</FormLabel>
                  <SimpleGrid columns={[2, null, 3]} spacing={4}>
                    {Object.keys(flavorIcons).map(flavor => (
                      <Box
                        key={flavor}
                        borderWidth={1}
                        borderRadius="md"
                        p={2}
                        bg={pizza.flavor === flavor ? 'teal.200' : 'white'}
                        cursor="pointer"
                        onClick={() => handleFlavorSelect(index, flavor)}
                      >
                        <Image src={flavorIcons[flavor]} boxSize="80px" mx="auto" />
                        <Text textAlign="center" mt={2}>{flavor}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Personalizações</FormLabel>
                  <Flex mt={2} mb={2}>
                    <Input
                      value={newCustomization}
                      onChange={(e) => setNewCustomization(e.target.value)}
                      placeholder="Ex: Extra bacon"
                      mr={2}
                    />
                    <Button colorScheme="blue" onClick={() => handleAddCustomization(index)}>
                      Adicionar
                    </Button>
                  </Flex>
                  <Box>
                    {pizza.customizations.map(customization => (
                      <Tag
                        key={customization}
                        size="lg"
                        variant="solid"
                        colorScheme="teal"
                        mr={2}
                        mb={2}
                      >
                        <TagLabel>{customization}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveCustomization(index, customization)} />
                      </Tag>
                    ))}
                  </Box>
                </FormControl>
              </Box>
            ))}
            <Button mt={4} colorScheme="blue" onClick={handleAddPizza}>
              Adicionar Pizza
            </Button>
            <Button mt={4} colorScheme="green" type="submit">
              Criar Pedido
            </Button>
          </VStack>
        </form>
        {loading && <Spinner mt={4} />}
        {order && (
          <Box mt={4} p={4} borderWidth={1} borderRadius="md" shadow="md" bg="white">
            <Heading size="md">Resumo do Pedido</Heading>
            <Text><strong>Valor Total:</strong> R$ {order.totalValue.toFixed(2)}</Text>
            <Text><strong>Tempo de Preparo:</strong> {order.totalPreparationTime} minutos</Text>
            <Heading size="sm" mt={2}>Detalhes das Pizzas</Heading>
            {order.pizzas.map((pizza: any, index: number) => (
              <Box key={index} mt={2}>
                <Text><strong>Tamanho:</strong> {pizza.size.name}</Text>
                <Text><strong>Sabor:</strong> {pizza.flavor.name}</Text>
                <Text><strong>Personalizações:</strong> {pizza.customizations.map((c: any) => c.name).join(', ')}</Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Center>
  );
};

export default OrderForm;