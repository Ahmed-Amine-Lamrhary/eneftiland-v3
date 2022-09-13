import Heading from "../components/Heading"
import FeatureBlock from "../components/FeatureBlock"
import { BsCodeSlash } from "react-icons/bs"
import { HiOutlineDocumentText } from "react-icons/hi"
import { GoSettings } from "react-icons/go"

import Page from "../components/Page"
import { PrismaClient } from "@prisma/client"
import PricingCalculator from "../components/PricingCalculator"
import { RiRulerLine } from "react-icons/ri"
import GetStartedButton from "../components/GetStartedButton"
import NavLink from "../components/NavLink"
import Image from "next/image"
import { FaRegSave } from "react-icons/fa"
import { Accordion } from "react-bootstrap"
import { FiArrowRight } from "react-icons/fi"
import Devider from "../components/Devider"
import { AnimationOnScroll } from "react-animation-on-scroll"

import ethImg from "../assets/home/compatible/eth.png"
import solImg from "../assets/home/compatible/sol.png"
import polImg from "../assets/home/compatible/pol.png"
import LifetimePlan from "../components/LifetimePlan"

declare var $crisp: any

export async function getServerSideProps(context: any) {
  const prisma = new PrismaClient()

  const settings = await prisma.settings.findFirst()
  const plans = await prisma.plan.findMany({
    orderBy: {
      assetsNumber: "asc",
    },
  })

  return {
    props: {
      settings,
      plans,
    },
  }
}

export default function IndexPage({ settings, plans }: any) {
  return (
    <Page title="No code NFT generator" settings={settings} isHeaderFixed>
      {/* Header */}
      <header className="header-section d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <AnimationOnScroll animateIn="animate__bounceInUp" animateOnce>
                <h1>
                  Create NFT Collections <br /> Easily With No Code
                </h1>
                <div className="mb-4">
                  <p>
                    Turn image layers into thousands of uniquely <br /> code
                    generated atworks.
                  </p>
                </div>

                <GetStartedButton theme="white">
                  Get Started <FiArrowRight />
                </GetStartedButton>
              </AnimationOnScroll>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <AnimationOnScroll
                animateIn="animate__bounceInUp"
                delay={100}
                animateOnce
              >
                <Image quality={50} src={require("../assets/home/home.png")} />
              </AnimationOnScroll>
            </div>
          </div>
        </div>
      </header>

      {/* Compatible with */}
      <div className="compatible-with-section">
        <div className="container small-container">
          <p>Compatible with</p>

          <div className="images">
            <div className="row">
              <div className="col">
                <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
                  <div
                    className="item"
                    style={{ backgroundImage: `url(${ethImg.src})` }}
                  />
                </AnimationOnScroll>
              </div>
              <div className="col">
                <AnimationOnScroll
                  animateIn="animate__fadeIn"
                  delay={50}
                  animateOnce
                >
                  <div
                    className="item"
                    style={{ backgroundImage: `url(${solImg.src})` }}
                  />
                </AnimationOnScroll>
              </div>
              <div className="col">
                <AnimationOnScroll
                  animateIn="animate__fadeIn"
                  delay={100}
                  animateOnce
                >
                  <div
                    className="item"
                    style={{ backgroundImage: `url(${polImg.src})` }}
                  />
                </AnimationOnScroll>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="how-it-works">
        <div className="container small-container">
          <Devider />

          <Heading title="How it works" className="text-center mb-5" />

          <div className="row">
            {/* Upload your art */}
            <div className="col-md-6 mt-4">
              <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
                <div className="item">
                  <div className="index">
                    <span>01</span>
                  </div>

                  <div>
                    <h5>Upload your art</h5>
                    <p className="paragraph">
                      Upload your layers to get started.
                    </p>
                  </div>
                </div>
              </AnimationOnScroll>
            </div>

            {/* Set rules and rarity */}
            <div className="col-md-6 mt-4">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={100}
                animateOnce
              >
                <div className="item">
                  <div className="index">
                    <span>02</span>
                  </div>

                  <div>
                    <h5>Set rules and rarity</h5>
                    <p className="paragraph">
                      Play around with trait rules and rarity until you like
                      what you see.
                    </p>
                  </div>
                </div>
              </AnimationOnScroll>
            </div>

            {/* Preview */}
            <div className="col-md-6 mt-4">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={200}
                animateOnce
              >
                <div className="item">
                  <div className="index">
                    <span>03</span>
                  </div>

                  <div>
                    <h5>Preview</h5>
                    <p className="paragraph">
                      Check the art and metadata with as many previews as you
                      like.
                    </p>
                  </div>
                </div>
              </AnimationOnScroll>
            </div>

            {/* Export */}
            <div className="col-md-6 mt-4">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={300}
                animateOnce
              >
                <div className="item">
                  <div className="index">
                    <span>04</span>
                  </div>

                  <div>
                    <h5>Export</h5>
                    <p className="paragraph">
                      When you’re ready, generate and download your collection.
                    </p>
                  </div>
                </div>
              </AnimationOnScroll>
            </div>
          </div>

          <Devider />
        </div>
      </div>

      {/* stats */}
      {/* <div className="stats-section">
        <div className="container">
          <div className="row">
            <div className="col">
              <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
                <h2>4,000+</h2>
                <p>Wallets Connected</p>
              </AnimationOnScroll>
            </div>
            <div className="col">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={100}
                animateOnce
              >
                <h2>4,000+</h2>
                <p>Wallets Connected</p>
              </AnimationOnScroll>
            </div>
            <div className="col">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={200}
                animateOnce
              >
                <h2>4,000+</h2>
                <p>Wallets Connected</p>
              </AnimationOnScroll>
            </div>
          </div>
        </div>

        <Devider />
      </div> */}

      {/* About */}
      <div className="about-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={100}
                animateOnce
              >
                <Heading
                  title="The easiest way to create NFT collectibles on the blockchain"
                  subTitle="Simple"
                  paragraph="Create up to 20,000 NFT collections, by uploading the layers. Without requiring code"
                />
              </AnimationOnScroll>
            </div>

            <div className="col-md-6">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={200}
                animateOnce
              >
                <Image
                  quality={50}
                  src={require("../assets/home/about/about.png")}
                />
              </AnimationOnScroll>
            </div>
          </div>

          <Devider />
        </div>
      </div>

      {/* Features */}
      <div id="features" className="features-section">
        <div className="container">
          <Heading
            subTitle="Fully Featured"
            title="Everything you need"
            paragraph="Built for artists and NFT creators"
          />

          <div className="row justify-content-center">
            <div className="col-md-4">
              <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
                <FeatureBlock
                  Icon={BsCodeSlash}
                  title="Super Simple (no code)"
                  content="Create NFT collectibles with ease, using the all-in-one generator."
                />
              </AnimationOnScroll>
            </div>

            <div className="col-md-4">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={100}
                animateOnce
              >
                <FeatureBlock
                  Icon={FaRegSave}
                  title="Save your collections"
                  content="Your collections will be saved in your account, so you can always come back and edit them."
                />
              </AnimationOnScroll>
            </div>

            <div className="col-md-4">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={200}
                animateOnce
              >
                <FeatureBlock
                  Icon={GoSettings}
                  title="Attribute Rarity"
                  content="You can configure certain attributes to be more rare than others."
                />
              </AnimationOnScroll>
            </div>

            <div className="col-md-4">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={300}
                animateOnce
              >
                <FeatureBlock
                  Icon={HiOutlineDocumentText}
                  title="Metadata"
                  content="We generate metadata compatible with Ethereum, Solana &amp; Polygon Blockchain."
                />
              </AnimationOnScroll>
            </div>

            <div className="col-md-4">
              <AnimationOnScroll
                animateIn="animate__fadeIn"
                delay={400}
                animateOnce
              >
                <FeatureBlock
                  Icon={RiRulerLine}
                  title="Set advanced trait rules"
                  content="Put layers in order and separate traits that don’t mix well with others."
                />
              </AnimationOnScroll>
            </div>
          </div>

          <Devider />
        </div>
      </div>

      {/* Pricing */}
      {plans.length > 0 && (
        <div id="pricing" className="pricing-section">
          <div className="container">
            <Heading subTitle="Pricing" title="Use for FREE" />

            <PricingCalculator plans={plans} />

            <div className="mt-5">
              <Heading subTitle="Special Offer" title="Lifetime Deal">
                <NavLink to="/lifetime-deal">Find out more</NavLink>
              </Heading>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-4">
                <LifetimePlan />
              </div>
            </div>

            <Devider />
          </div>
        </div>
      )}

      {/* Frequently asked questions */}
      <div id="faq" className="faq-section">
        <div className="container small-container">
          <Heading title="FAQ" className="text-center">
            <p className="paragraph">
              If you still got a question you're always welcome to{" "}
              <NavLink
                to=""
                onClick={(e: any) => {
                  e.preventDefault()
                  $crisp.push(["do", "chat:open"])
                }}
              >
                contact us
              </NavLink>
            </p>
          </Heading>

          <div className="faq">
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>What are NFTs?</Accordion.Header>
                <Accordion.Body>
                  <p className="paragraph">
                    NFTs, or non-fungible tokens, are unique digital assets
                    stored on a blockchain. NFTs aren't interchangeable, which
                    means each is one of a kind. They can come in the form of
                    illustrations, animated GIFs, songs, items for video games,
                    and other forms of digital art.
                  </p>
                  <p className="paragraph">
                    Some of the first NFTs ever made were PFPs, aka profile
                    pics, designed to be used as avatars. CryptoPunks, Robotos,
                    BAYC, Cool Cats, and Doodles are among the most famous PFP
                    NFT projects.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  How is the metadata.json structured?
                </Accordion.Header>
                <Accordion.Body>
                  <p className="paragraph">
                    The metadata contains information on the rarity of each
                    trait and asset, the specific files use to make a particular
                    NFT, the name of your collection, and the description of
                    your collection.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  Can I set trait rules and rarity?
                </Accordion.Header>
                <Accordion.Body>
                  <p className="paragraph">
                    Yes! You can easily set rules and make some traits rarer
                    than others with the click of a button.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  What files should I use as layers?
                </Accordion.Header>
                <Accordion.Body>
                  <p className="paragraph">
                    For the moment we support .png, .jpeg, .jpg and .svg files.
                    Your layers should have the variations of each trait of your
                    NFT character.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="5">
                <Accordion.Header>How many NFTs can I create?</Accordion.Header>
                <Accordion.Body>
                  <p className="paragraph">
                    You can create as many as you want.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Ready? */}
      <div className="ready-section text-center">
        <div className="ready-section-overlay">
          <div className="container">
            <Heading
              paragraph="Start uploading and create the next big NFT collection"
              title="Ready to get started?"
              className="mb-4"
            />

            <AnimationOnScroll
              animateIn="animate__fadeIn"
              delay={100}
              animateOnce
            >
              <GetStartedButton>GET STARTED</GetStartedButton>
            </AnimationOnScroll>
          </div>
        </div>
      </div>
    </Page>
  )
}
