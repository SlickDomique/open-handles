import Head from "next/head";
import HandleForm from "./components/HandleForm";
import { useState } from "react";

export default function Home() {
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <>
      <Head>
        <title>Get custom BlueSky handle</title>
        <meta name="description" content="Custom BlueSky handles for free" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gradient-to-w flex min-h-screen flex-col from-[#fff] to-[#f3f9ff]">
        <div className="bg-[#f3f9ff]">
          <div className="align-center  w-full gap-12 px-4 py-16 text-center">
            <h1 className="text-lg font-extrabold tracking-tight text-gray sm:text-[2rem]">
              Get customised <span className="text-[#0560ff]">BlueSky</span>{" "}
              handle
            </h1>
          </div>
        </div>
        <div className="triangles"></div>
        <div className="flex">
          <button
            type="button"
            className={`ml-auto mr-auto mt-3
               inline-flex w-full place-self-center rounded-md bg-blue  px-3 py-2 text-sm text-white shadow-sm sm:w-auto`}
            onClick={() => setHelpVisible(true)}
          >
            What do I need to do?
          </button>
        </div>
        <div>
          <div className={`${!helpVisible ? "hidden" : ""} container p-3`}>
            <div>
              1. Go to your settings on bluesky at{" "}
              <a
                href="https://bsky.app/settings"
                target="_blank"
                className=" text-blue hover:text-blueLight"
              >
                https://bsky.app/settings
              </a>
            </div>
            <div>
              {`2. Click "Change handle" and "I have my own domain" in the popup`}
            </div>
            3. Fill the desired handle with one of the available endings and
            copy the domain value to a field below
          </div>
        </div>
        <div className="container">
          <div className=" flex flex-col items-center gap-12 px-4 py-3">
            <HandleForm />
          </div>
        </div>
        <div className="container">
          <div className=" mt-5 flex flex-col items-center gap-2 px-4 py-3 text-center text-sm text-slate-500">
            <div>
              Free and open source{" "}
              <a
                className="text-blue hover:text-blueLight"
                href="https://github.com/SlickDomique/open-handles"
                target="_blank"
              >
                github.com/SlickDomique/open-handles
              </a>
            </div>
            If you like my work you can donate on{" "}
            <a
              href="https://ko-fi.com/domi_zip"
              target="_blank"
              className="inline-flex items-center gap-x-2 text-center text-blue hover:text-blueLight"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#e33232"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                />
              </svg>
              https://ko-fi.com/domi_zip
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
