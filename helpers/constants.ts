export const errorMessages = {
  requiredField: "This field is required",

  collectionSizeMin: "Minimum collection size is 1",
  collectionSizeMax: "Maximum collection size is 20000",

  sizeMin: "Minimum item dimensions is 5",
  sizeMax: "Maximum item dimensions is 2400",

  royaltiesMin: "Minimum royalties percentage is 0",
  royaltiesMax: "Maximum royalties percentage is 100",

  layers: "Please add at least 1 layer",
  layerName: "Each layer should have a name",
  layerImages: "Please add at least 1 image in each layer",
}

export const blendList: any = [
  "source-over",
  "source-in",
  "source-out",
  "source-out",
  "destination-over",
  "destination-in",
  "destination-out",
  "destination-atop",
  "lighter",
  "copy",
  "xor",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
]

export const NETWORK = {
  eth: "eth",
  sol: "sol",
}

const zeroDecimalCurrencies = [
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]

export const getPaymentAmount = (amount: number, currency: any) => {
  if (zeroDecimalCurrencies.includes(currency)) return amount
  return amount * 100
}

export const plansFeaturesDelimiter = "|||"

export const CURRENCY = "USD"

// networks
export const networkParams: any = {
  "0x89": {
    chainName: "Polygon Mainnet",
    chainId: "0x89",
    nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
    rpcUrls: ["https://polygon-rpc.com/"],
  },
  "0x13881": {
    chainName: "Mumbai Testnet",
    chainId: "0x13881",
    nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  },
}

// eneftiland demo
export const DEMO_RESULTS = "5+4,4+0,3+1,2+2,1+4,0+0|5+3,4+4,3+0,2+0,1+3,0+0|5+1,4+2,3+3,2+1,1+0,0+2|5+1,4+0,3+2,2+2,1+0,0+4|5+0,4+4,3+3,2+0,1+4,0+1|5+4,4+1,3+4,2+0,1+0,0+0|5+0,4+0,3+2,2+2,1+2,0+3|5+2,4+1,3+0,2+3,1+1,0+2|5+4,4+2,3+3,2+1,1+0,0+2|5+2,4+1,3+0,2+3,1+0,0+3|5+3,4+0,3+1,2+0,1+2,0+3|5+3,4+4,3+2,2+4,1+1,0+4|5+1,4+4,3+0,2+0,1+4,0+3|5+2,4+1,3+4,2+2,1+4,0+4|5+2,4+0,3+1,2+3,1+0,0+3|5+1,4+1,3+1,2+2,1+0,0+3|5+2,4+1,3+1,2+4,1+2,0+3|5+1,4+4,3+0,2+0,1+1,0+2|5+1,4+2,3+0,2+4,1+4,0+2|5+1,4+4,3+4,2+3,1+0,0+1|5+2,4+0,3+4,2+1,1+1,0+1|5+4,4+2,3+2,2+3,1+2,0+1|5+3,4+0,3+1,2+2,1+1,0+0|5+3,4+4,3+3,2+3,1+2,0+4|5+3,4+4,3+0,2+1,1+1,0+3|5+0,4+0,3+4,2+2,1+3,0+2|5+0,4+4,3+0,2+0,1+1,0+0|5+4,4+0,3+2,2+3,1+2,0+1|5+3,4+0,3+0,2+1,1+2,0+0|5+3,4+2,3+2,2+4,1+3,0+2|5+2,4+2,3+3,2+0,1+3,0+3|5+2,4+3,3+3,2+3,1+3,0+1|5+1,4+1,3+1,2+0,1+2,0+1|5+4,4+2,3+3,2+4,1+0,0+4|5+3,4+0,3+3,2+4,1+0,0+2|5+1,4+3,3+3,2+2,1+0,0+4|5+1,4+1,3+4,2+3,1+4,0+1|5+1,4+2,3+3,2+1,1+0,0+3|5+0,4+3,3+4,2+3,1+2,0+1|5+2,4+3,3+2,2+4,1+2,0+1|5+3,4+3,3+0,2+0,1+4,0+3|5+1,4+2,3+0,2+1,1+3,0+2|5+2,4+1,3+4,2+3,1+1,0+4|5+4,4+0,3+4,2+1,1+2,0+2|5+4,4+4,3+4,2+2,1+3,0+4|5+0,4+4,3+1,2+0,1+2,0+4|5+3,4+2,3+2,2+3,1+0,0+1|5+3,4+4,3+1,2+2,1+4,0+3|5+1,4+3,3+1,2+4,1+2,0+1|5+1,4+0,3+4,2+2,1+0,0+0|5+2,4+3,3+4,2+3,1+4,0+2|5+3,4+0,3+2,2+1,1+2,0+1|5+3,4+3,3+2,2+1,1+1,0+0|5+2,4+1,3+4,2+3,1+0,0+0|5+1,4+0,3+3,2+2,1+0,0+0|5+2,4+1,3+0,2+1,1+0,0+1|5+1,4+2,3+1,2+4,1+3,0+4|5+2,4+1,3+4,2+1,1+4,0+1|5+4,4+0,3+4,2+3,1+1,0+2|5+2,4+3,3+3,2+1,1+4,0+2|5+1,4+4,3+3,2+0,1+4,0+3|5+3,4+1,3+4,2+4,1+1,0+1|5+3,4+0,3+3,2+2,1+0,0+1|5+1,4+4,3+0,2+1,1+3,0+4|5+2,4+1,3+3,2+0,1+0,0+3|5+2,4+3,3+4,2+0,1+0,0+1|5+1,4+2,3+3,2+1,1+1,0+0|5+0,4+2,3+1,2+2,1+3,0+0|5+4,4+4,3+3,2+1,1+0,0+2|5+2,4+1,3+3,2+3,1+0,0+0|5+1,4+3,3+4,2+4,1+2,0+2|5+2,4+0,3+1,2+0,1+1,0+1|5+1,4+4,3+0,2+2,1+3,0+2|5+0,4+3,3+0,2+4,1+4,0+1|5+2,4+3,3+3,2+1,1+4,0+1|5+1,4+2,3+2,2+4,1+2,0+1|5+0,4+0,3+2,2+1,1+4,0+3|5+4,4+4,3+2,2+4,1+0,0+2|5+4,4+3,3+4,2+2,1+2,0+4|5+4,4+2,3+1,2+4,1+3,0+4|5+1,4+4,3+1,2+4,1+4,0+3|5+0,4+2,3+0,2+2,1+0,0+1|5+4,4+0,3+0,2+1,1+0,0+3|5+0,4+2,3+1,2+2,1+4,0+1|5+2,4+1,3+4,2+3,1+4,0+4|5+3,4+2,3+4,2+2,1+4,0+3|5+0,4+3,3+4,2+4,1+4,0+1|5+3,4+0,3+1,2+1,1+1,0+1|5+1,4+1,3+2,2+1,1+2,0+0|5+3,4+4,3+4,2+1,1+0,0+2|5+4,4+4,3+0,2+0,1+1,0+1|5+1,4+0,3+2,2+0,1+3,0+3|5+3,4+1,3+0,2+3,1+1,0+3|5+0,4+3,3+4,2+1,1+0,0+4|5+1,4+0,3+4,2+0,1+2,0+1|5+3,4+1,3+3,2+2,1+4,0+2|5+4,4+0,3+0,2+1,1+3,0+2|5+4,4+0,3+2,2+1,1+3,0+1|5+1,4+2,3+2,2+2,1+3,0+3|5+3,4+2,3+0,2+3,1+3,0+3"

export const DEMO_LAYERS = `[{"id":"c9009ac08ce7f","name":"eyes","images":[{"id":"aa25d9bb755a1","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0001s_0004_Eyes","filename":"jakejessop406_giraffe_NFT_SF_0001s_0004_Eyes.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0001s_0004_Eyes_72U8KjftY.png"},{"id":"3c2742318a3a8","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0001s_0003_New-group","filename":"jakejessop406_giraffe_NFT_SF_0001s_0003_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0001s_0003_New-group_nl2tr4b-A.png"},{"id":"84c34c97c8185","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0001s_0000_New-group","filename":"jakejessop406_giraffe_NFT_SF_0001s_0000_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0001s_0000_New-group_vTLTtjF2O.png"},{"id":"6f5a405039e8a","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0001s_0001_New-group","filename":"jakejessop406_giraffe_NFT_SF_0001s_0001_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0001s_0001_New-group_dIc3rpUKi.png"},{"id":"4bb80d4042e8a","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0001s_0002_New-group","filename":"jakejessop406_giraffe_NFT_SF_0001s_0002_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0001s_0002_New-group_OWfPJh63Q.png"}],"options":{"bypassDNA":false,"blend":"source-over","opacity":1},"totalPoints":250},{"id":"478aa2b9d8c9","name":"hats","images":[{"id":"4df4e30a87854","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0002s_0001_New-group","filename":"jakejessop406_giraffe_NFT_SF_0002s_0001_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0002s_0001_New-group_3RphAfp6U.png"},{"id":"0ca2fc0d3610a","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0002s_0003_New-group","filename":"jakejessop406_giraffe_NFT_SF_0002s_0003_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0002s_0003_New-group_WAuNOQtHZ.png"},{"id":"47cd125b487f1","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0002s_0002_New-group","filename":"jakejessop406_giraffe_NFT_SF_0002s_0002_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0002s_0002_New-group_ZKCSUWoOx.png"},{"id":"279dfbf9dd28c","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0002s_0000_New-group","filename":"jakejessop406_giraffe_NFT_SF_0002s_0000_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0002s_0000_New-group_FfdMkcY7a.png"},{"id":"c385db11d421e","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0002s_0004_New-group","filename":"jakejessop406_giraffe_NFT_SF_0002s_0004_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0002s_0004_New-group_Mx8-E2aBN.png"}],"options":{"bypassDNA":false,"blend":"source-over","opacity":1},"totalPoints":250},{"id":"3dacf7664d109","name":"clothes","images":[{"id":"6890208ea7284","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0003s_0004_New-group","filename":"jakejessop406_giraffe_NFT_SF_0003s_0004_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0003s_0004_New-group_J3_HwfRgC.png"},{"id":"e28addb984a4c","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0003s_0003_New-group","filename":"jakejessop406_giraffe_NFT_SF_0003s_0003_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0003s_0003_New-group_d8NWdTRob.png"},{"id":"5aed3399dfc67","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0003s_0000_New-group","filename":"jakejessop406_giraffe_NFT_SF_0003s_0000_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0003s_0000_New-group_GYj6hRPkwg.png"},{"id":"f301ee0792f8a","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0003s_0001_New-group","filename":"jakejessop406_giraffe_NFT_SF_0003s_0001_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0003s_0001_New-group_7yZGcd3Gg.png"},{"id":"cd497ec94bef3","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0003s_0002_New-group","filename":"jakejessop406_giraffe_NFT_SF_0003s_0002_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0003s_0002_New-group_n1q45AVsr.png"}],"options":{"bypassDNA":false,"blend":"source-over","opacity":1},"totalPoints":250},{"id":"7022ea140905a","name":"mouths","images":[{"id":"3459bc187b4ce","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0000s_0003_New-group","filename":"jakejessop406_giraffe_NFT_SF_0000s_0003_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0000s_0003_New-group_ET3dZ3v0w.png"},{"id":"ef2abe05e9845","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0000s_0004_New-group","filename":"jakejessop406_giraffe_NFT_SF_0000s_0004_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0000s_0004_New-group_W6-Ti979l.png"},{"id":"513f47dd7a63b","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0000s_0000_New-group","filename":"jakejessop406_giraffe_NFT_SF_0000s_0000_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0000s_0000_New-group_3doQ21SYF.png"},{"id":"e1e3b0bec8a69","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0000s_0001_New-group","filename":"jakejessop406_giraffe_NFT_SF_0000s_0001_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0000s_0001_New-group_A8CX9lOXO.png"},{"id":"d987b6d2b633c","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0000s_0002_New-group","filename":"jakejessop406_giraffe_NFT_SF_0000s_0002_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0000s_0002_New-group_7HuM8bOxU.png"}],"options":{"bypassDNA":false,"blend":"source-over","opacity":1},"totalPoints":250},{"id":"5c4a8623897b1","name":"base","images":[{"id":"7b20ecd1adf81","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0004s_0004_New-group","filename":"jakejessop406_giraffe_NFT_SF_0004s_0004_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0004s_0004_New-group_wpPit4WoQ.png"},{"id":"07bc99ea49b99","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0004s_0002_Layer-11","filename":"jakejessop406_giraffe_NFT_SF_0004s_0002_Layer-11.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0004s_0002_Layer-11_KNJoOFHFk.png"},{"id":"767266c873f3a","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0004s_0001_Layer-11","filename":"jakejessop406_giraffe_NFT_SF_0004s_0001_Layer-11.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0004s_0001_Layer-11_OD97vqtiF.png"},{"id":"144a80cb088e1","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0004s_0003_New-group","filename":"jakejessop406_giraffe_NFT_SF_0004s_0003_New-group.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0004s_0003_New-group_3mUc7e5lBt.png"},{"id":"84ea5abd5341c","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0004s_0000_Layer-11","filename":"jakejessop406_giraffe_NFT_SF_0004s_0000_Layer-11.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0004s_0000_Layer-11_V6qEWvGuA.png"}],"options":{"bypassDNA":false,"blend":"source-over","opacity":1},"totalPoints":250},{"id":"d266517a18159","name":"bg","images":[{"id":"4ce25bf8a4b48","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0005s_0003_Layer-105","filename":"jakejessop406_giraffe_NFT_SF_0005s_0003_Layer-105.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0005s_0003_Layer-105_DCGe-yN3M.png"},{"id":"8a68e01567d78","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0005s_0002_Layer-106","filename":"jakejessop406_giraffe_NFT_SF_0005s_0002_Layer-106.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0005s_0002_Layer-106_n9CX_Ik2r.png"},{"id":"3ad8b9d09604b","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0005s_0001_Layer-107","filename":"jakejessop406_giraffe_NFT_SF_0005s_0001_Layer-107.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0005s_0001_Layer-107_sYATNhfkU.png"},{"id":"ba03f26032948","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0005s_0000_Layer-108","filename":"jakejessop406_giraffe_NFT_SF_0005s_0000_Layer-108.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0005s_0000_Layer-108_l150NjUIE.png"},{"id":"96a1cca056283","rarity":50,"name":"jakejessop406_giraffe_NFT_SF_0005s_0004_Layer-105","filename":"jakejessop406_giraffe_NFT_SF_0005s_0004_Layer-105.png","url":"https://ik.imagekit.io/cz0lhx3az/jakejessop406_giraffe_NFT_SF_0005s_0004_Layer-105_UY-K0ih4s.png"}],"options":{"bypassDNA":false,"blend":"source-over","opacity":1},"totalPoints":250}]`