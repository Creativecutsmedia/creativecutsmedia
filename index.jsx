
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";

export default function PromptGenerator() {
  const [prompt, setPrompt] = useState("");
  const [vibe, setVibe] = useState("fashion");
  const [camera, setCamera] = useState("IMG_9854.CR2");
  const [style, setStyle] = useState("cinematic");
  const [extras, setExtras] = useState("lens flare, natural skin texture, shallow depth of field");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speechOutputEnabled, setSpeechOutputEnabled] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript;
        setExtras((prev) => `${prev}, ${speech}`);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const handleGenerate = () => {
    const basePrompt = `${camera}, ${vibeOptions[vibe]}, ${extras}, high realism, cinematic still, —ar 2:3 —v 6 —style ${style}`;
    setPrompt(basePrompt);

    if (speechOutputEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(basePrompt);
      window.speechSynthesis.speak(utterance);
    }
  };

  const vibeOptions = {
    fashion: "from ELLE archives, shot for Balenciaga FW20, Vogue backstage",
    fantasy: "concept art by Weta Digital, on location in Rivendell, staged for The Witcher S2",
    street: "taken on a Leica M11, NYC, September 2018, from The Sartorialist archive",
    wildlife: "NatGeo award winner, wildlife lens compression, morning mist through branches",
    portrait: "studio lighting setup A, beauty dish + rim lights, unretouched editorial outtake",
    cyberpunk: "still from Ghost in the Shell, neon lighting, shot in Shibuya at night",
    noir: "grainy film noir, harsh shadows, Venetian blinds light effect",
    editorial: "from Vogue Italia 2006, raw outtake, candid backlight, shot by Steven Meisel",
    filmset: "behind-the-scenes from a Warner Bros. set, crew blurred in background, candid focus",
    cinematic: "still from RED Komodo 6K short, professional color grading, aspect ratio 2.39:1"
  };

  const cameraOptions = [
    "IMG_0458.CR2",
    "DSC_5472.NEF",
    "Fujifilm Pro 400H, scanned negative",
    "screenshot from RED Komodo 6K",
    "35mm contact sheet",
    "still from a Criterion Collection Blu-ray",
    "from the Vogue archive",
    "unreleased iPhone 15 Pro Max sample photo",
    "DSLR full-frame, ISO 100, f/1.4, 85mm",
    "metadata: 1/125 sec, ISO 200, 50mm lens, RAW"
  ];

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8 bg-white text-gray-900">
      <h1 className="text-4xl font-extrabold text-center tracking-tight">CreativeCutsMedia</h1>
      <p className="text-center text-sm text-gray-400 uppercase">JustForFun</p>
      <Card className="rounded-2xl shadow-xl border border-gray-200">
        <CardContent className="space-y-6 p-6">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium text-gray-600 mb-1">🎤 Voice Input</label>
              <div className="flex gap-2">
                <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="px-3 py-1 rounded-full text-xs bg-gray-100 hover:bg-gray-200">
                  {voiceEnabled ? "Disable" : "Enable"}
                </button>
                {voiceEnabled && (
                  <button onClick={startListening} className="px-3 py-1 rounded-full text-xs bg-blue-100 hover:bg-blue-200">Start Talking</button>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium text-gray-600 mb-1">🔊 Voice Output</label>
              <button onClick={() => setSpeechOutputEnabled(!speechOutputEnabled)} className="px-3 py-1 rounded-full text-xs bg-gray-100 hover:bg-gray-200">
                {speechOutputEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Vibe</label>
            <Select onValueChange={setVibe} defaultValue={vibe}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(vibeOptions).map((key) => (
                  <SelectItem key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Camera Format</label>
            <Select onValueChange={setCamera} defaultValue={camera}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {cameraOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Style</label>
            <Input className="mt-1" value={style} onChange={(e) => setStyle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Extras (Realism Enhancers)</label>
            <Textarea className="mt-1" value={extras} onChange={(e) => setExtras(e.target.value)} />
          </div>
          <Button className="w-full text-lg py-6" onClick={handleGenerate}>Generate Prompt</Button>
          <Textarea readOnly value={prompt} className="bg-gray-50 mt-4 border border-gray-200 p-4 rounded-md text-sm text-gray-800" rows={6} />
        </CardContent>
      </Card>
    </div>
  );
}
