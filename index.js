const axios = require("axios")
const https = require("https")

const httpsAgent = new https.Agent({
//   maxVersion: "TLSv1.2",
  minVersion: "TLSv1.2",
})

const baseURL = "https://www.howsmyssl.com"

const instance = axios.create({
  baseURL: baseURL,
  responseType: "json",
  timeout: 30000,
  httpsAgent: httpsAgent,
})

const axiosInstance = async (options) => {
  try {
    const response = await instance(options)

    const { status, data } = response

    return { status, data }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response

      return { status, data }
    } else if (error.request) {
      if (error.code === "ECONNABORTED") {
        const retorno = {
          status: 504,
          data: {
            message: `${error.message}`,
          },
        }
        return retorno
      } else {
        const retorno = {
          status: 502,
          data: {
            message: `${error.message}`,
          },
        }
        return retorno
      }
    } else {
      const retorno = {
        status: 500,
        data: {
          message: `${error.message}`,
        },
      }

      return retorno
    }
  }
}

async function run() {
  const options = {
    method: "GET",
    url: "/a/check",
  }

  const retorno = await axiosInstance(options)

  console.log("TLS_VERSION: ", retorno.data.tls_version)
}

run().catch((err) => console.log(err))
