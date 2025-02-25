// import {
//   PublicKey,
//   publicKey,
//   Umi,
// } from "@metaplex-foundation/umi";
// import { DigitalAssetWithToken, JsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
// import dynamic from "next/dynamic";
// import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
// import { useUmi } from "../utils/useUmi";
// import { fetchCandyMachine, safeFetchCandyGuard, CandyGuard, CandyMachine, AccountVersion } from "@metaplex-foundation/mpl-candy-machine"
// import styles from "../styles/Home.module.css";
// import { guardChecker } from "../utils/checkAllowed";
// import { Center, Card, CardHeader, CardBody, StackDivider, Heading, Stack, useToast, Text, Skeleton, useDisclosure, Button, Modal, ModalBody, ModalCloseButton, ModalContent, Image, ModalHeader, ModalOverlay, Box, Divider, VStack, Flex } from '@chakra-ui/react';
// import { ButtonList } from "../components/mintButton";
// import { GuardReturn } from "../utils/checkerHelper";
// import { ShowNft } from "../components/showNft";
// import { InitializeModal } from "../components/initializeModal";
// import { image, headerText } from "../settings";
// import { useSolanaTime } from "@/utils/SolanaTimeContext";
// import { CheeseHeader } from "../components/cheeseHeader";
// import { Link } from "@chakra-ui/react";
// const WalletMultiButtonDynamic = dynamic(
//   async () =>
//     (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
//   { ssr: false }
// );


// const useCandyMachine = (
//   umi: Umi,
//   candyMachineId: string,
//   checkEligibility: boolean,
//   setCheckEligibility: Dispatch<SetStateAction<boolean>>,
//   firstRun: boolean,
//   setfirstRun: Dispatch<SetStateAction<boolean>>
// ) => {
//   const [candyMachine, setCandyMachine] = useState<CandyMachine>();
//   const [candyGuard, setCandyGuard] = useState<CandyGuard>();
//   const toast = useToast();


//   useEffect(() => {
//     (async () => {
//       if (checkEligibility) {
//         if (!candyMachineId) {
//           console.error("No candy machine in .env!");
//           if (!toast.isActive("no-cm")) {
//             toast({
//               id: "no-cm",
//               title: "No candy machine in .env!",
//               description: "Add your candy machine address to the .env file!",
//               status: "error",
//               duration: 999999,
//               isClosable: true,
//             });
//           }
//           return;
//         }

//         let candyMachine;
//         try {
//           candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
//           //verify CM Version
//           if (candyMachine.version != AccountVersion.V2){
//             toast({
//               id: "wrong-account-version",
//               title: "Wrong candy machine account version!",
//               description: "Please use latest sugar to create your candy machine. Need Account Version 2!",
//               status: "error",
//               duration: 999999,
//               isClosable: true,
//             });
//             return;
//           }
//         } catch (e) {
//           console.error(e);
//           toast({
//             id: "no-cm-found",
//             title: "The CM from .env is invalid",
//             description: "Are you using the correct environment?",
//             status: "error",
//             duration: 999999,
//             isClosable: true,
//           });
//         }
//         setCandyMachine(candyMachine);
//         if (!candyMachine) {
//           return;
//         }
//         let candyGuard;
//         try {
//           candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
//         } catch (e) {
//           console.error(e);
//           toast({
//             id: "no-guard-found",
//             title: "No Candy Guard found!",
//             description: "Do you have one assigned?",
//             status: "error",
//             duration: 999999,
//             isClosable: true,
//           });
//         }
//         if (!candyGuard) {
//           return;
//         }
//         setCandyGuard(candyGuard);
//         if (firstRun){
//           setfirstRun(false)
//         }
//       }
//     })();
//   }, [umi, checkEligibility]);

//   return { candyMachine, candyGuard };


// };


// export default function Home() {
//   const umi = useUmi();
//   const solanaTime = useSolanaTime();
//   const toast = useToast();
//   const { isOpen: isShowNftOpen, onOpen: onShowNftOpen, onClose: onShowNftClose } = useDisclosure();
//   const { isOpen: isInitializerOpen, onOpen: onInitializerOpen, onClose: onInitializerClose } = useDisclosure();
//   const [mintsCreated, setMintsCreated] = useState<{ mint: PublicKey, offChainMetadata: JsonMetadata | undefined }[] | undefined>();
//   const [isAllowed, setIsAllowed] = useState<boolean>(false);
//   const [loading, setLoading] = useState(true);
//   const [ownedTokens, setOwnedTokens] = useState<DigitalAssetWithToken[]>();
//   const [guards, setGuards] = useState<GuardReturn[]>([
//     { label: "startDefault", allowed: false, maxAmount: 0 },
//   ]);
//   const [firstRun, setFirstRun] = useState(true);
//   const [checkEligibility, setCheckEligibility] = useState<boolean>(true);


//   if (!process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
//     console.error("No candy machine in .env!")
//     if (!toast.isActive('no-cm')) {
//       toast({
//         id: 'no-cm',
//         title: 'No candy machine in .env!',
//         description: "Add your candy machine address to the .env file!",
//         status: 'error',
//         duration: 999999,
//         isClosable: true,
//       })
//     }
//   }
//   const candyMachineId: PublicKey = useMemo(() => {
//     if (process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
//       return publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
//     } else {
//       console.error(`NO CANDY MACHINE IN .env FILE DEFINED!`);
//       toast({
//         id: 'no-cm',
//         title: 'No candy machine in .env!',
//         description: "Add your candy machine address to the .env file!",
//         status: 'error',
//         duration: 999999,
//         isClosable: true,
//       })
//       return publicKey("11111111111111111111111111111111");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   const { candyMachine, candyGuard } = useCandyMachine(umi, candyMachineId, checkEligibility, setCheckEligibility, firstRun, setFirstRun);

//   useEffect(() => {
//     const checkEligibilityFunc = async () => {
//       if (!candyMachine || !candyGuard || !checkEligibility || isShowNftOpen) {
//         return;
//       }
//       setFirstRun(false);
      
//       const { guardReturn, ownedTokens } = await guardChecker(
//         umi, candyGuard, candyMachine, solanaTime
//       );

//       setOwnedTokens(ownedTokens);
//       setGuards(guardReturn);
//       setIsAllowed(false);

//       let allowed = false;
//       for (const guard of guardReturn) {
//         if (guard.allowed) {
//           allowed = true;
//           break;
//         }
//       }

//       setIsAllowed(allowed);
//       setLoading(false);
//     };

//     checkEligibilityFunc();
//     // On purpose: not check for candyMachine, candyGuard, solanaTime
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [umi, checkEligibility, firstRun]);

//   const PageContent = () => {
//     return (
//       <>
//         <style jsx global>
//           {`
//       html,
//       body {
//         margin: 0;
//         padding: 0;
//         height: 100%;
//       }
//       body {
//           background: url("/bg3.jpg") no-repeat center center;
//           background-size: cover;
//           background-color: rgb(231, 182, 77);
//        }
//    `}
//         </style>
//         <Card bg="rgb(253, 168, 10)" borderRadius={"25"}>
//           <CardHeader>
//             <Flex 
//             minWidth='max-content'
//             alignItems='center' 
//             gap='2'
//             direction={{ base: "column", md: "row" }}
//             justifyContent={{ base: "center", md: "space-between" }}
//             >
//               <Box textAlign={{ base: "center", md: "left" }}>
//                 <Heading color={"#ffffff"} size={{base: 'sm', md: 'lg'}}>{headerText}</Heading>
//               </Box>
//               {loading ? (<></>) : (
//                 <Flex
//                 justifyContent={{ base: "center", md: "flex-end" }}
//                 marginLeft={{ base: 0, md: "auto" }}
//                 >
//                   <Box 
//                   bg="orange.500"
//                   borderRadius="5px"
//                   px={4}
//                   py={2}
//                   mt={{ base: 2, md: 0 }}
//                   // center text on mobile
//                   textAlign={{ base: "center", md: "right" }}
//                   >
//                     <VStack >
//                       <Text color={"#ffffff"} fontSize={{base: 'xs', md: 'sm'}}>Available NFTs:</Text>
//                       <Text color={"#ffffff"} fontSize={{base: 'xs', md: 'sm'}} fontWeight={"semibold"}>{Number(candyMachine?.data.itemsAvailable) - Number(candyMachine?.itemsRedeemed)}/{Number(candyMachine?.data.itemsAvailable)}</Text>
//                     </VStack>
//                   </Box>
//                 </Flex>
//               )}
//             </Flex>
//           </CardHeader>

//           <CardBody color={"#ffffff"}>
//             <Center>
//               <Box
//                 rounded={'lg'}
//                 mt={-12}
//                 pos={'relative'}>
//                 <Image
//                   marginTop={"30"}
//                   rounded={'lg'}
//                   height={{ base: "150px", md: "250px" }}
//                   objectFit={'cover'}
//                   alt={"project Image"}
//                   src={image}
//                 />
//               </Box>
//             </Center>
//             <Stack divider={<StackDivider />} spacing='8'>
//               {loading ? (
//                 <div>
//                   <Divider my="10px" />
//                   <Skeleton height="30px" my="10px" />
//                   <Skeleton height="30px" my="10px" />
//                   <Skeleton height="30px" my="10px" />
//                 </div>
//               ) : (
//                 <ButtonList
//                   guardList={guards}
//                   candyMachine={candyMachine}
//                   candyGuard={candyGuard}
//                   umi={umi}
//                   ownedTokens={ownedTokens}
//                   setGuardList={setGuards}
//                   mintsCreated={mintsCreated}
//                   setMintsCreated={setMintsCreated}
//                   onOpen={onShowNftOpen}
//                   setCheckEligibility={setCheckEligibility}
//                 />
//               )}
//             </Stack>
//           </CardBody>
//         </Card >
//         {umi.identity.publicKey === candyMachine?.authority ? (
//           <>
//             <Center>
//               <Button backgroundColor={"red.200"} marginTop={"10"} onClick={onInitializerOpen}>Initialize Everything!</Button>
//             </Center>
//             <Modal isOpen={isInitializerOpen} onClose={onInitializerClose}>
//               <ModalOverlay />
//               <ModalContent maxW="600px">
//                 <ModalHeader>Initializer</ModalHeader>
//                 <ModalCloseButton />
//                 <ModalBody>
//                   < InitializeModal umi={umi} candyMachine={candyMachine} candyGuard={candyGuard} />
//                 </ModalBody>
//               </ModalContent>
//             </Modal>

//           </>)
//           :
//           (<>
//             <br></br>
//             <Center fontSize={"sm"}>
//               <Text textAlign="center" backgroundColor={"blackAlpha.400"}> Built by our friendly Cheese Engineers and Designers with Metaplex Candy Machine. </Text>
//             </Center>
//             <br></br>
//             <Center>
//                 <Link textAlign="center" backgroundColor={"blackAlpha.400"} href="https://www.solana.fm/address/FemTGn3aL8FMjVrQcbR1hV9L1QmfiZta7C5KSFzGw6Vr">Click to Explore Candy Machine</Link>
//             </Center>
//             <br></br>
//             <Center>
//                 <Link textAlign="center" backgroundColor={"blackAlpha.400"} href="https://magiceden.us/marketplace/8tzxtMj4TNAq8GSmxwTjWAgczUR5o7xrTSNWgzH7fYX7">View the Collection</Link>
//             </Center>
//             <br></br>
//             <Center >
//               <Text textAlign="center" backgroundColor={"blackAlpha.400"}> NO REFUNDS. </Text>
//             </Center>
//           </>)
//         }

//         <Modal isOpen={isShowNftOpen} onClose={onShowNftClose}>
//           <ModalOverlay />
//           <ModalContent background={"orange.400"} borderRadius={"5px"}>
//             <ModalHeader fontSize={"3xl"} >Your minted NFT:</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               <ShowNft nfts={mintsCreated} />
//             </ModalBody>
//           </ModalContent>
//         </Modal>
//       </>
//     );
//   };

//   return (
//     <main>
//       <div className={styles.wallet}>
//         {/* <WalletMultiButtonDynamic /> */}
//         <CheeseHeader />
//       </div>

//       <div className={styles.center}>
//         <PageContent key="content" />
//       </div>
//     </main>
//   );
// }


import {
  PublicKey,
  publicKey,
  Umi,
} from "@metaplex-foundation/umi";
import { DigitalAssetWithToken, JsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useUmi } from "../utils/useUmi";
import {
  fetchCandyMachine,
  safeFetchCandyGuard,
  CandyGuard,
  CandyMachine,
  AccountVersion,
} from "@metaplex-foundation/mpl-candy-machine";
import styles from "../styles/Home.module.css";
import { guardChecker } from "../utils/checkAllowed";
import {
  Center,
  Card,
  CardHeader,
  CardBody,
  StackDivider,
  Heading,
  Stack,
  useToast,
  Text,
  Skeleton,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Image,
  ModalHeader,
  ModalOverlay,
  Box,
  Divider,
  VStack,
  Flex,
  Link,
} from "@chakra-ui/react";
import { ButtonList } from "../components/mintButton";
import { GuardReturn } from "../utils/checkerHelper";
import { ShowNft } from "../components/showNft";
import { InitializeModal } from "../components/initializeModal";
import { image, headerText } from "../settings";
import { useSolanaTime } from "@/utils/SolanaTimeContext";
import { CheeseHeader } from "../components/cheeseHeader";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const useCandyMachine = (
  umi: Umi,
  candyMachineId: string,
  checkEligibility: boolean,
  setCheckEligibility: Dispatch<SetStateAction<boolean>>,
  firstRun: boolean,
  setfirstRun: Dispatch<SetStateAction<boolean>>
) => {
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [candyGuard, setCandyGuard] = useState<CandyGuard>();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      if (checkEligibility) {
        if (!candyMachineId) {
          console.error("No candy machine in .env!");
          if (!toast.isActive("no-cm")) {
            toast({
              id: "no-cm",
              title: "No candy machine in .env!",
              description: "Add your candy machine address to the .env file!",
              status: "error",
              duration: 999999,
              isClosable: true,
            });
          }
          return;
        }

        let machine;
        try {
          machine = await fetchCandyMachine(umi, publicKey(candyMachineId));
          // Verify Candy Machine account version
          if (machine.version !== AccountVersion.V2) {
            toast({
              id: "wrong-account-version",
              title: "Wrong candy machine account version!",
              description:
                "Please use the latest sugar to create your candy machine. Need Account Version 2!",
              status: "error",
              duration: 999999,
              isClosable: true,
            });
            return;
          }
        } catch (e) {
          console.error(e);
          toast({
            id: "no-cm-found",
            title: "The CM from .env is invalid",
            description: "Are you using the correct environment?",
            status: "error",
            duration: 999999,
            isClosable: true,
          });
        }
        setCandyMachine(machine);

        if (!machine) {
          return;
        }

        let guard;
        try {
          guard = await safeFetchCandyGuard(umi, machine.mintAuthority);
        } catch (e) {
          console.error(e);
          toast({
            id: "no-guard-found",
            title: "No Candy Guard found!",
            description: "Do you have one assigned?",
            status: "error",
            duration: 999999,
            isClosable: true,
          });
        }
        if (!guard) {
          return;
        }
        setCandyGuard(guard);

        if (firstRun) {
          setfirstRun(false);
        }
      }
    })();
  }, [umi, checkEligibility]);

  return { candyMachine, candyGuard };
};

export default function Home() {
  const umi = useUmi();
  const solanaTime = useSolanaTime();
  const toast = useToast();
  const {
    isOpen: isShowNftOpen,
    onOpen: onShowNftOpen,
    onClose: onShowNftClose,
  } = useDisclosure();
  const {
    isOpen: isInitializerOpen,
    onOpen: onInitializerOpen,
    onClose: onInitializerClose,
  } = useDisclosure();

  const [mintsCreated, setMintsCreated] = useState<
    { mint: PublicKey; offChainMetadata: JsonMetadata | undefined }[] | undefined
  >();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [ownedTokens, setOwnedTokens] = useState<DigitalAssetWithToken[]>();
  const [guards, setGuards] = useState<GuardReturn[]>([
    { label: "startDefault", allowed: false, maxAmount: 0 },
  ]);
  const [firstRun, setFirstRun] = useState(true);
  const [checkEligibility, setCheckEligibility] = useState<boolean>(true);

  if (!process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
    console.error("No candy machine in .env!");
    if (!toast.isActive("no-cm")) {
      toast({
        id: "no-cm",
        title: "No candy machine in .env!",
        description: "Add your candy machine address to the .env file!",
        status: "error",
        duration: 999999,
        isClosable: true,
      });
    }
  }

  const candyMachineId: PublicKey = useMemo(() => {
    if (process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
      return publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
    } else {
      console.error(`NO CANDY MACHINE IN .env FILE DEFINED!`);
      toast({
        id: "no-cm",
        title: "No candy machine in .env!",
        description: "Add your candy machine address to the .env file!",
        status: "error",
        duration: 999999,
        isClosable: true,
      });
      return publicKey("11111111111111111111111111111111");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { candyMachine, candyGuard } = useCandyMachine(
    umi,
    candyMachineId.toString(),
    checkEligibility,
    setCheckEligibility,
    firstRun,
    setFirstRun
  );

  useEffect(() => {
    const checkEligibilityFunc = async () => {
      if (!candyMachine || !candyGuard || !checkEligibility || isShowNftOpen) {
        return;
      }
      setFirstRun(false);

      const { guardReturn, ownedTokens } = await guardChecker(
        umi,
        candyGuard,
        candyMachine,
        solanaTime
      );

      setOwnedTokens(ownedTokens);
      setGuards(guardReturn);
      setIsAllowed(false);

      let allowed = false;
      for (const guard of guardReturn) {
        if (guard.allowed) {
          allowed = true;
          break;
        }
      }

      setIsAllowed(allowed);
      setLoading(false);
    };

    checkEligibilityFunc();
    // Intentionally not including candyMachine, candyGuard, solanaTime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umi, checkEligibility, firstRun]);

  // Check if all items are minted
  const allItemsMinted =
    candyMachine &&
    Number(candyMachine.data.itemsAvailable) - Number(candyMachine.itemsRedeemed) === 0;

  const PageContent = () => {
    return (
      <>
        <style jsx global>
          {`
            html,
            body {
              margin: 0;
              padding: 0;
              height: 100%;
            }
            body {
              background: url("/bg3.jpg") no-repeat center center;
              background-size: cover;
              background-color: rgb(231, 182, 77);
            }
          `}
        </style>

        {/* Make the card position relative so we can overlay the 'Sold out!' banner */}
        <Card bg="rgb(253, 168, 10)" borderRadius="25" position="relative">
          {/* If sold out, add a dim overlay + diagonal banner */}
          {allItemsMinted && (
            <>
              {/* Dim the card behind the banner */}
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bg="rgba(0, 0, 0, 0.4)" // adjust opacity as needed
                borderRadius="inherit"
                zIndex={1}
              />
              {/* Diagonal 'Sold out!' ribbon */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%) rotate(-45deg)"
                bg="red.500"
                color="white"
                fontSize="2xl"
                fontWeight="bold"
                px={28} // Adjust horizontal padding for how wide you want the banner
                py={3}
                boxShadow="md"
                zIndex={2}
                textAlign="center"
              >
                Sold out!
              </Box>
            </>
          )}

          <CardHeader>
            <Flex
              minWidth="max-content"
              alignItems="center"
              gap="2"
              direction={{ base: "column", md: "row" }}
              justifyContent={{ base: "center", md: "space-between" }}
            >
              <Box textAlign={{ base: "center", md: "left" }}>
                <Heading color="#ffffff" size={{ base: "sm", md: "lg" }}>
                  {headerText}
                </Heading>
              </Box>
              {!loading && (
                <Flex
                  justifyContent={{ base: "center", md: "flex-end" }}
                  marginLeft={{ base: 0, md: "auto" }}
                >
                  <Box
                    bg="orange.500"
                    borderRadius="5px"
                    px={4}
                    py={2}
                    mt={{ base: 2, md: 0 }}
                    textAlign={{ base: "center", md: "right" }}
                  >
                    <VStack>
                      <Text color="#ffffff" fontSize={{ base: "xs", md: "sm" }}>
                        Available NFTs:
                      </Text>
                      <Text
                        color="#ffffff"
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="semibold"
                      >
                        {Number(candyMachine?.data.itemsAvailable) -
                          Number(candyMachine?.itemsRedeemed)}
                        /{Number(candyMachine?.data.itemsAvailable)}
                      </Text>
                    </VStack>
                  </Box>
                </Flex>
              )}
            </Flex>
          </CardHeader>

          <CardBody color="#ffffff">
            <Center>
              <Box rounded="lg" mt={-12} pos="relative">
                <Image
                  marginTop="30"
                  rounded="lg"
                  height={{ base: "150px", md: "250px" }}
                  objectFit="cover"
                  alt="project Image"
                  src={image}
                />
              </Box>
            </Center>
            <Stack divider={<StackDivider />} spacing="8">
              {loading ? (
                <div>
                  <Divider my="10px" />
                  <Skeleton height="30px" my="10px" />
                  <Skeleton height="30px" my="10px" />
                  <Skeleton height="30px" my="10px" />
                </div>
              ) : (
                <ButtonList
                  guardList={guards}
                  candyMachine={candyMachine}
                  candyGuard={candyGuard}
                  umi={umi}
                  ownedTokens={ownedTokens}
                  setGuardList={setGuards}
                  mintsCreated={mintsCreated}
                  setMintsCreated={setMintsCreated}
                  onOpen={onShowNftOpen}
                  setCheckEligibility={setCheckEligibility}
                />
              )}
            </Stack>
          </CardBody>
        </Card>

        {umi.identity.publicKey === candyMachine?.authority ? (
          <>
            <Center>
              <Button backgroundColor="red.200" mt="10" onClick={onInitializerOpen}>
                Initialize Everything!
              </Button>
            </Center>
            <Modal isOpen={isInitializerOpen} onClose={onInitializerClose}>
              <ModalOverlay />
              <ModalContent maxW="600px">
                <ModalHeader>Initializer</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <InitializeModal
                    umi={umi}
                    candyMachine={candyMachine}
                    candyGuard={candyGuard}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <>
            <br />
            <Center fontSize="sm">
              <Text textAlign="center" backgroundColor="blackAlpha.400">
                Built by our friendly Cheese Engineers and Designers with Metaplex Candy Machine.
              </Text>
            </Center>
            <br />
            <Center>
              <Link
                textAlign="center"
                backgroundColor="blackAlpha.400"
                href="https://www.solana.fm/address/FemTGn3aL8FMjVrQcbR1hV9L1QmfiZta7C5KSFzGw6Vr"
              >
                Click to Explore Candy Machine
              </Link>
            </Center>
            <br />
            <Center>
              <Link
                textAlign="center"
                backgroundColor="blackAlpha.400"
                href="https://magiceden.us/marketplace/8tzxtMj4TNAq8GSmxwTjWAgczUR5o7xrTSNWgzH7fYX7"
              >
                View the Collection
              </Link>
            </Center>
            <br />
            <Center>
              <Text textAlign="center" backgroundColor="blackAlpha.400">
                NO REFUNDS.
              </Text>
            </Center>
          </>
        )}

        <Modal isOpen={isShowNftOpen} onClose={onShowNftClose}>
          <ModalOverlay />
          <ModalContent background="orange.400" borderRadius="5px">
            <ModalHeader fontSize="3xl">Your minted NFT:</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ShowNft nfts={mintsCreated} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };

  return (
    <main>
      <div className={styles.wallet}>
        {/* <WalletMultiButtonDynamic /> */}
        <CheeseHeader />
      </div>

      <div className={styles.center}>
        <PageContent key="content" />
      </div>
    </main>
  );
}
