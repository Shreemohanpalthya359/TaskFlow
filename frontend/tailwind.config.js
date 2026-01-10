export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brandStart: "#5B6CFF",
        brandMid: "#8B5CF6",
        brandEnd: "#EC4899",
        surface: "#F8F9FF",
        textPrimary: "#1F2937",
        textMuted: "#6B7280"
      },
      fontSize: {
        hero: "56px",
        heroMobile: "40px",
        sectionTitle: "36px",
        sectionSub: "16px"
      },
      borderRadius: {
        xl2: "20px",
        xl3: "28px"
      },
      boxShadow: {
        hero: "0 40px 80px rgba(0,0,0,0.18)",
        card: "0 20px 50px rgba(0,0,0,0.12)"
      }
    }
  },
  plugins: []
}
