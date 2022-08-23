import Button from "../components/Button"
import Heading from "../components/Heading"
import Section from "../components/Section"
import FeatureBlock from "../components/FeatureBlock"
import PlanBlock from "../components/PlanBlock"
import { BsCodeSlash } from "react-icons/bs"
import { AiOutlineEye } from "react-icons/ai"
import {
  HiOutlineDatabase,
  HiOutlineDocumentText,
  HiOutlineUpload,
} from "react-icons/hi"
import { BiImages } from "react-icons/bi"
import { GoSettings } from "react-icons/go"

import Page from "../components/Page"
import { PrismaClient } from "@prisma/client"
import PricingCalculator from "../components/PricingCalculator"
import { CURRENCY } from "../helpers/constants"
import { RiRulerLine } from "react-icons/ri"
import GetStartedButton from "../components/GetStartedButton"

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
    <Page title="Home" settings={settings}>
      {/* Header */}
      <header className="header-section d-flex align-items-center">
        <div className="container">
          <h1>
            Create NFT Collections <br /> Easily With No Code
          </h1>
          <div className="mb-4">
            <p>
              Turn image layers into thousands of uniquely <br /> code generated
              atworks.
            </p>
          </div>

          <GetStartedButton theme="white">Get Started</GetStartedButton>
        </div>
      </header>

      {/* How it works */}
      <Section className="bg-grey">
        <Heading title="How it works" />
        <div className="row">
          {/* Upload your art */}
          <div className="col">
            <HiOutlineUpload size={40} />
            <h5 className="mt-3">1. Upload your art</h5>
            <p className="paragraph">Upload your layers to get started.</p>
          </div>
          {/* Set rules and rarity */}
          <div className="col">
            <GoSettings size={40} />
            <h5 className="mt-3">2. Set rules and rarity</h5>
            <p className="paragraph">
              Play around with trait rules and rarity until you like what you
              see.
            </p>
          </div>
          {/* Preview */}
          <div className="col">
            <AiOutlineEye size={40} />
            <h5 className="mt-3">3. Preview</h5>
            <p className="paragraph">
              Check the art and metadata with as many previews as you like.
            </p>
          </div>
          {/* Export */}
          <div className="col">
            <BiImages size={40} />
            <h5 className="mt-3">4. Export</h5>
            <p className="paragraph">
              When you’re ready, generate and upload your collection to IPFS.
            </p>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section id="features-section" className="features-section">
        <Heading
          subTitle="Fully Featured"
          title="Everything you need"
          paragraph="Built for artists and NFT creators"
        />

        <div className="row justify-content-center">
          <div className="col-md-4">
            <FeatureBlock
              Icon={BsCodeSlash}
              title="Super Simple (no code)"
              content="Create NFT collectibles with ease, using the all-in-one generator"
            />
          </div>
          <div className="col-md-4">
            <FeatureBlock
              Icon={GoSettings}
              title="Attribute Rarity"
              content="You can configure certain attributes to be more rare than others. You will be able to easily tell what are the change for an attribute to be applied."
            />
          </div>
          <div className="col-md-4">
            <FeatureBlock
              Icon={HiOutlineDocumentText}
              title="Metadata"
              content="We generate metadata compatible with Ethereum, Solana &amp; Polygon Blockchain."
            />
          </div>
          <div className="col-md-4">
            <FeatureBlock
              Icon={RiRulerLine}
              title="Set advanced trait rules"
              content="Put layers in order and separate traits that don’t mix well with others."
            />
          </div>
          <div className="col-md-4">
            <FeatureBlock
              Icon={HiOutlineDatabase}
              title="Store your collection via IPFS"
              content="Your collection will be automatically uploaded to IPFS after the generation."
            />
          </div>
        </div>
      </Section>

      {/* Pricing */}
      {plans.length > 0 && (
        <Section id="pricing-section" className="pricing-section bg-grey">
          <Heading subTitle="Pricing" title="Use for FREE" />

          <div className="row justify-content-center">
            {plans?.map((plan: any) => (
              <div key={`plan-${plan.id}`} className="col-lg-3 col-md-6 mb-4">
                <PlanBlock plan={plan} currencyCode={CURRENCY} />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <PricingCalculator plans={plans} currency={CURRENCY} />
          </div>
        </Section>
      )}

      {/* Frequently asked questions */}
      <Section>
        <Heading title="Frequently asked questions" className="text-center">
          <p className="paragraph">
            If you still got a question you're always welcome to{" "}
            <a href="mailto:eneftiland@email.com">email us</a>
          </p>
        </Heading>

        <div className="row">
          {/*  */}
          <div className="col-6 mb-5">
            <h6>What are NFTs?</h6>
            <p className="paragraph">
              NFTs, or non-fungible tokens, are unique digital assets stored on
              a blockchain. NFTs aren't interchangeable, which means each is one
              of a kind. They can come in the form of illustrations, animated
              GIFs, songs, items for video games, and other forms of digital
              art.
            </p>
            <p className="paragraph">
              Some of the first NFTs ever made were PFPs, aka profile pics,
              designed to be used as avatars. CryptoPunks, Robotos, BAYC, Cool
              Cats, and Doodles are among the most famous PFP NFT projects.
            </p>
          </div>

          {/*  */}
          <div className="col-6 mb-5">
            <h6>How is the metadata.json structured?</h6>
            <p className="paragraph">
              The metadata contains information on the rarity of each trait and
              asset, the specific files use to make a particular NFT, the name
              of your collection, and the description of your collection.
            </p>
          </div>

          {/*  */}
          <div className="col-6 mb-5">
            <h6>Can I set trait rules and rarity?</h6>
            <p className="paragraph">
              Yes! You can easily set rules and make some traits rarer than
              others with the click of a button.
            </p>
          </div>

          {/*  */}
          <div className="col-6 mb-5">
            <h6>What files should I use as layers?</h6>
            <p className="paragraph">
              For the moment we support .png, .jpeg, .jpg and .svg files. Your
              layers should have the variations of each trait of your NFT
              character.
            </p>
          </div>

          {/*  */}
          <div className="col-6">
            <h6>How many NFTs can I create?</h6>
            <p className="paragraph">You can create as many as you want.</p>
          </div>
        </div>
      </Section>

      {/* Ready? */}
      <Section className="ready-section text-center bg-grey">
        <Heading
          paragraph="Start uploading and create the next big NFT collection"
          title="Ready to get started?"
          className="mb-4"
        />

        <GetStartedButton className="btn-outline">
          Generate Your Collection
        </GetStartedButton>
      </Section>
    </Page>
  )
}
