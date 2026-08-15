- a/config.js
+++ b/config.js
@@ -1,13 +1,15 @@
 export const CONFIG = {
-  mode: "api",        // أو api
+  mode: "api",
   demoDelay: 1000,
   timeout: 5000,
+
   api: {
     demo: "...",
-    real: "https://gov-server.com/api",
+    real: "http://127.0.0.1:3001",        
     real: "https://127.0.0.1:8080",

   },
+
   storage: {
     theme: "light",
     language: "en"
   }
-}
+};
:

