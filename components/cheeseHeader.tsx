import React from "react";
import NextLink from "next/link";
import { Flex, Box, Image, Link, Spacer, useBreakpointValue } from "@chakra-ui/react";
// or import { WalletMultiButtonDynamic } from "...";
// (depending on how you're importing it)
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

export function CheeseHeader() {
  // Decide spacing or alignment based on screen size
  const navGap = useBreakpointValue({ base: 4, md: 8 });

  return (
    <Box
      as="header"
      w="100%"
      color="white"
      px={6}
      py={4}
      marginTop={"-10"}
      marginBottom={"-100"}
      boxShadow="md"     // a small shadow under the header
    >
      <Flex
        maxW="1000"    // width container
        mx="auto"        // center horizontally
        align="center"
      >
        {/* Left side: Logo */}
        <Box>
          <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
            <Image
              src="/cheese_coin.png" // replace with your actual cheese coin logo path
              alt="Cheese Coin Logo"
              w="65px"
              h="65px"
            />
          </Link>
        </Box>
        {/* Center: Navigation */}
        <Flex
          as="nav"
          ml={8}
          gap={navGap}
          fontFamily="'Single Day', cursive"   // or any custom font you use
          fontWeight="bold"
          fontSize={{ base: "5xl", md: "5xl" }}
        >
          <Link as={NextLink} href="https://www.cheesescoin.com/" _hover={{ color: "yellow.300" }}>
            HOME
          </Link>
        </Flex>

        {/* “Spacer” pushes the wallet button to the far right */}
        <Spacer />

        {/* Right side: Connect Wallet Button */}
        <Box>
          {/* If you’re using the “Dynamic” version: <WalletMultiButtonDynamic /> */}
          <WalletMultiButtonDynamic />
        </Box>
      </Flex>
    </Box>
  );
}
