import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { api } from "~/utils/api";
import Select from "../Select";
import regex from "~/utils/regex";
import { domains } from "~/utils/domains";

interface IMessage {
  success: boolean;
  content: string;
}

type Timer = ReturnType<typeof setTimeout>;

export default function HandleForm() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [handleValue, sethandleValue] = useState("");
  const [domainValue, setDomainValue] = useState("");
  const [domainName, setDomainName] = useState(
    `${Object.keys(domains)[0] || ""}`
  );

  const [handleValueValidator, sethandleValueValidator] =
    useState<boolean>(false);
  const [domainValueValidator, setDomainValueValidator] =
    useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const domainType = domains[domainName] || "file";

  const utils = api.useContext();
  const [timer, setTimer] = useState<Timer | undefined>(undefined);

  const recordMutation = api.handle.createNew.useMutation({
    // eslint-disable-next-line @typescript-eslint/require-await
    onMutate: async (response) => {
      await utils.handle.invalidate();
    },
  });

  const delayedInput =
    (
      onChange: Dispatch<SetStateAction<string>>,
      action: Dispatch<SetStateAction<boolean>>,
      regex: RegExp
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);

      clearTimeout(timer);

      const newTimer = setTimeout(() => {
        if (event.target.value.length > 0 && !event.target.value.match(regex)) {
          action(true);
        } else {
          action(false);
        }
      }, 345);

      setTimer(newTimer);
    };

  const addRecord = () => {
    if (recordMutation.isLoading) return;

    recordMutation.mutate({
      handleValue,
      domainValue,
      domainName,
    });
  };

  return (
    <>
      <div className="3xl:w-1/3 w-full lg:w-2/4">
        <Select value={domainName} onChange={setDomainName} />

        <div className="mt-2">
          Preview: @{handleValue || "customHandle"}.{domainName}
        </div>
        {domainType === "file" ? (
          <div className="mt-5 rounded-md bg-grayLight p-3 font-light">
            <div className="pt-2">Enter your handle: </div>
            <div className="font-mono">
              <input
                onChange={delayedInput(
                  sethandleValue,
                  sethandleValueValidator,
                  regex.handleValueRegex
                )}
                value={handleValue}
                className="inline-block rounded-md border border-slate-300 bg-white py-2 pl-3 pr-3 shadow-sm placeholder:italic placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                placeholder="customHandle"
                type="text"
              />
              .{domainName}
            </div>
            <div className="pt-2">Upload a text file to:</div>
            <div className="font-mono">
              https://{handleValue || "customHandle"}.{domainName}
              /.well-known/atproto-did
            </div>
            {handleValueValidator && (
              <div className="mb-5 mt-3 rounded-md border border-slate-300 bg-red px-3 py-2 shadow-sm">
                custom handle value is wrong (has to start or end with a letter
                or number)
              </div>
            )}
            <div className="pt-2">Value:</div>
            <div className="font-mono">
              <input
                onChange={delayedInput(
                  setDomainValue,
                  setDomainValueValidator,
                  regex.fileDidValue
                )}
                value={domainValue}
                className="block w-full rounded-md border border-slate-300 bg-white py-2 pl-3 pr-3 shadow-sm placeholder:italic placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                placeholder="did:plc:7bwr7mioqql34n2mrqwqypbz"
                type="text"
              />
            </div>
            {domainValueValidator && (
              <div className="mb-5 mt-3 rounded-md border border-slate-300 bg-red px-3 py-2 shadow-sm">
                make sure you copied the value correctly
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-md bg-grayLight p-3 font-light">
            <div>Domain: </div>
            <div className="font-mono">
              _atproto.
              <input
                onChange={delayedInput(
                  sethandleValue,
                  sethandleValueValidator,
                  regex.handleValueRegex
                )}
                value={handleValue}
                className="inline-block rounded-md border border-slate-300 bg-white py-2 pl-3 pr-3 shadow-sm placeholder:italic placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                placeholder="customHandle"
                type="text"
              />
              .{domainName}
            </div>
            {handleValueValidator && (
              <div className="mb-5 mt-3 rounded-md border border-slate-300 bg-red px-3 py-2 shadow-sm">
                custom handle value is wrong (has to start or end with a letter
                or number)
              </div>
            )}
            <div className="pt-2">Type:</div>
            <div className="font-mono">TXT</div>
            <div className="pt-2">Value:</div>
            <div className="font-mono">
              <input
                onChange={delayedInput(
                  setDomainValue,
                  setDomainValueValidator,
                  regex.dnsDidValue
                )}
                value={domainValue}
                className="block w-full rounded-md border border-slate-300 bg-white py-2 pl-3 pr-3 shadow-sm placeholder:italic placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                placeholder="did:plc:7bwr7mioqql34n2mrqwqypbz"
                type="text"
              />
            </div>
            {domainValueValidator && (
              <div className="mb-5 mt-3 rounded-md border border-slate-300 bg-red px-3 py-2 shadow-sm">
                make sure you copied the value correctly
              </div>
            )}
          </div>
        )}
        <div className="container">
          <button
            type="button"
            className={`${
              domainValueValidator ||
              domainValue.length === 0 ||
              handleValueValidator ||
              handleValue.length === 0 ||
              recordMutation.isLoading
                ? "bg-blueDark"
                : "cursor-pointer bg-blue"
            } mt-3 inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm text-white shadow-sm sm:w-auto`}
            onClick={addRecord}
            disabled={
              !recordMutation.error &&
              (domainValueValidator ||
                domainValue.length === 0 ||
                handleValueValidator ||
                handleValue.length === 0 ||
                recordMutation.isLoading ||
                recordMutation.isSuccess)
            }
          >
            Create handle
          </button>
          {recordMutation.error && (
            <div className="mb-5 mt-3 rounded-md border border-slate-300 bg-red px-3 py-2 shadow-sm">
              {recordMutation.error.message}
            </div>
          )}
          {recordMutation.isSuccess && (
            <div className="mb-5 mt-3 rounded-md border border-slate-300 bg-green px-3 py-2 shadow-sm">
              {`Record added succesfully! Click "Verify" button in Bluesky`}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
