// "use client";
// import React, { useEffect } from "react";
// import { Grid, Paper } from "@mui/material";
// import { useForm } from "react-hook-form";
// import PreviewBox from "./PreviewBox";
// import StyleControls from "./StyleControl";
// import Scripted from "./Scripted";
// import { useGetLexBotStylingQuery } from "@/src/redux/services/organization/organizationApi";

// const StyleEditor = () => {
//   const { data, error, isLoading } = useGetLexBotStylingQuery();

//   const { register, watch, control, setValue } = useForm({
//     defaultValues: {
//       primaryColor: "#ff2600ff",
//       backgroundColor: "#ffffff",
//       borderColor: "#e0e0e0",
//       fontFamily: "Roboto",
//       fontSize: 16,
//       borderRadius: 12,
//       padding: 12,
//       welcomeMessage: "Hello! How can I help?",
//       botMessageColor: "#f1f1f1",
//       userMessageColor: "#fafafa",
//       headerColor: "#0066ff",
//     },
//   });

//   useEffect(() => {
//     if (data) {
//       console.log("Lex Bot Styling Data:", data);

//       setValue("welcomeMessage", data.welcomeMessage);
//       setValue("backgroundColor", data.background);
//       setValue("headerColor", data.headerColor);
//       setValue("userMessageColor", data.userMessageColor);
//       setValue("botMessageColor", data.botMessageColor);
//     }

//     if (error) {
//       console.error("Error fetching Lex Bot Styling:", error);
//     }
//   }, [data, error, setValue]);

//   const values = watch();

//   return (
//     <Grid
//       container
//       spacing={4}
//       sx={{
//         height: "100vh",
//         p: 4,
//         display: "flex",
//         alignItems: "baseline",
//         justifyContent: "space-between",
//       }}
//     >
//       <Grid>
//         <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
//           <StyleControls
//             register={register}
//             setValue={setValue}
//             watch={watch}
//             control={control}
//           />
//         </Paper>
//       </Grid>

//       <Grid>
//         <Paper
//           elevation={2}
//           sx={{
//             p: 4,
//             // borderRadius: 3,
//             height: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             // bgcolor: "#fafafa",
//             gap: 4,
//           }}
//         >
//           <PreviewBox values={values} />
//         </Paper>
//         <Scripted cloudfrontUrl={data?.cloudfront_url} />
//       </Grid>
//     </Grid>
//   );
// };

// export default StyleEditor;
"use client";
import React, { useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import PreviewBox from "./PreviewBox";
import StyleControls from "./StyleControl";
import Scripted from "./Scripted";
import { useGetLexBotStylingQuery } from "@/src/redux/services/organization/organizationApi";

const StyleEditor = () => {
  const { data, error } = useGetLexBotStylingQuery();

  const { register, watch, control, setValue } = useForm({
    defaultValues: {
      primaryColor: "#FFA726",
      backgroundColor: "#FFFFFF",
      borderColor: "#e0e0e0",
      fontSize: 16,
      borderRadius: 12,
      padding: 12,
      botMessage: "Hi, I'm Bot 🤖",
      userMessage: "I need your help!",
      botMessageColor: "#F8BBD0",
      userMessageColor: "#FFECB3",
      headerColor: "#BBDEFB",
      welcomeMessage: "Hello! How can I help?",
    },
  });

  useEffect(() => {
    if (data) {
      console.log("Lex Bot Styling Data:", data);

      setValue("botMessage", data.botMessage);
      setValue("userMessage", data.userMessage);
      setValue("backgroundColor", data.background);
      setValue("headerColor", data.headerColor);
      setValue("userMessageColor", data.userMessageColor);
      setValue("botMessageColor", data.botMessageColor);
      setValue("primaryColor", data.primaryColor);
      setValue("fontSize", data.fontSize);
      setValue("borderRadius", data.borderRadius);
      setValue("welcomeMessage", data.welcomeMessage);
    }

    if (error) {
      console.error("Error fetching Lex Bot Styling:", error);
    }
  }, [data, error, setValue]);

  const values = watch();

  return (
    <Grid
      container
      spacing={4}
      sx={{
        height: "100vh",
        p: 4,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        // maxWidth: "780px",
        width: "100%",
      }}
    >
      <Grid>
        <Paper
          elevation={2}
          sx={{ p: 3, borderRadius: 3, height: "100%", width: "110%",maxWidth:"160%" }}
        >
          <StyleControls
            register={register}
            setValue={setValue}
            watch={watch}
            control={control}
          />
        </Paper>
      </Grid>

      <Grid>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            width: "100%",
          }}
        >
          <PreviewBox values={values} />
        </Paper>
        <Scripted cloudfrontUrl={data?.cloudfront_url} />
      </Grid>
    </Grid>
  );
};

export default StyleEditor;
