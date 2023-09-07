-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "adminId" TEXT,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "lifetime" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "verificationtoken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "price" REAL NOT NULL,
    "assetsNumber" REAL NOT NULL,
    "features" TEXT NOT NULL,
    "watermark" BOOLEAN NOT NULL DEFAULT false,
    "priceToRemoveWatermark" REAL
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "label" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "method" TEXT,
    "currency" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "watermarkUrl" TEXT,
    "watermarkPos" TEXT NOT NULL DEFAULT 'bottom-right',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "businessName" TEXT,
    "googleAnalyticsTrackingCode" TEXT,
    "paypalClientId" TEXT,
    "isPaypal" BOOLEAN NOT NULL DEFAULT false,
    "metamaskAddress" TEXT,
    "isMetamask" BOOLEAN NOT NULL DEFAULT false,
    "stripePublishableKey" TEXT,
    "stripeSecretKey" TEXT,
    "isStripe" BOOLEAN NOT NULL DEFAULT false,
    "razorpayPublicKey" TEXT,
    "isRazorpay" BOOLEAN NOT NULL DEFAULT false,
    "isBeta" BOOLEAN
);

-- CreateTable
CREATE TABLE "privacypage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT 'Privacy Policy',
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "termspage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT 'Terms and Services',
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "layers" TEXT NOT NULL,
    "galleryLayers" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "collectionDesc" TEXT NOT NULL,
    "collectionName" TEXT NOT NULL,
    "collectionSize" INTEGER NOT NULL,
    "creators" TEXT NOT NULL,
    "externalUrl" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "royalties" REAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "cid" TEXT,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT,
    "ipfsGateway" TEXT,
    "imagesCid" TEXT,
    "metaCid" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "isHistory" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "collectionshare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "forAdmin" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "collectionshare_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    "trait1" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "trait2" TEXT NOT NULL,
    CONSTRAINT "rule_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "isSuper" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "redumption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "useDate" DATETIME,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "redumption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "collaborations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    CONSTRAINT "collaborations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "collaborations_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtoken_token_key" ON "verificationtoken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtoken_identifier_token_key" ON "verificationtoken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "plan_price_key" ON "plan"("price");

-- CreateIndex
CREATE UNIQUE INDEX "plan_assetsNumber_key" ON "plan"("assetsNumber");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");
