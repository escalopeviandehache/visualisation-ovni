import { defineConfig } from "vite";
import dsv from '@rollup/plugin-dsv'


export default defineConfig({
    root: "src", //Racine de notre projet
    build : {
        outDir: "../build", //Change le chemin et le nom du fichier du build
        // Par défaut : target: "modules"
        target: "ES2022", //Valide seulement pour les nouveaux navigateur et pas les anciens
        emptyOutDir: true, //Garde seulement la version du dernier build
    }, 
    plugins: [
        dsv()
    ],
});