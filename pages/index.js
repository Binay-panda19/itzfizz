import Head from "next/head";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Head>
        <title>Mazda RX-7 FD | Drive the Legend</title>
        <meta
          name="description"
          content="Experience the legendary Mazda RX-7 FD — a rotary icon of pure driving spirit, sculpted in lightweight perfection."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <Hero />
      </main>
    </>
  );
}
