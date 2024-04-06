import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const { convert } = require("html-to-text");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    throw new Error("Method not allowed");
  }

  const userUrl = req.body.url;
  console.log("User url: ", userUrl);

  const options = {
    wordwrap: 130,
  };

  // Call this when you want to fetch the content of the entire HTML
  //   const entirePageText = await getEntirePageText(userUrl, options);

  // Call this when you want to fetch only the content of the Div
  const entireDivText = await getEntireDivText(userUrl, options);

  const metadata = { topic: "baseball" };
  uploadDocumentToPinecone(entireDivText, metadata);

  res.status(200).json({ message: "Data Insert Success" });
}

const uploadDocumentToPinecone = async (pageContent: string, metadata) => {
  const document = new Document({
    pageContent: pageContent,
    metadata: metadata,
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

  await PineconeStore.fromDocuments([document], new OpenAIEmbeddings(), {
    pineconeIndex,
  });

  console.log("Document uploaded to Pinecone successfully");
};

/**
 * Fetches the text content present in the Div
 * @param pageUrl
 * @param options
 * @returns
 */
const getEntireDivText = async (pageUrl: string, options) => {
  const divContent = await extractDivContentByClassName(
    pageUrl,
    "readMoreText"
  );
  const divContentText = convert(divContent, options);
  console.log(divContentText);
  return divContentText;
};

/**
 * Fetches the text content present in the entire page
 * @param pageUrl
 * @param options
 * @returns
 */
const getEntirePageText = async (pageUrl: string, options) => {
  const htmlContent = await getHtmlContent(pageUrl);
  const text = convert(htmlContent, options);
  console.log(text);
  return text;
};

const getHtmlContent = async (pageUrl: string) => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page open the website and wait until the dom content is loaded (HTML is ready)
  await page.goto(pageUrl, {
    waitUntil: "domcontentloaded",
  });

  const html = await page.content();

  // Close the browser
  await browser.close();
  return html;
};

// Extract the content of the div with the given class name from the website.
const extractDivContentByClassName = async (
  pageUrl: string,
  className: string
) => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page open the website and wait until the DOM content is loaded (HTML is ready)
  await page.goto(pageUrl, {
    waitUntil: "domcontentloaded",
  });

  // Extract the content of the div with the class name 'readMoreText'
  const divContent = await page.$eval(`.${className}`, (div) => div.innerHTML);

  // Close the browser
  await browser.close();
  return divContent;
};