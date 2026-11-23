/* Local, credited plates for the reading list. Keys match the topic and author index. */
(() => {
  "use strict";
  const plates = {
  "ethics-0": {
    "kind": "人物肖像",
    "title": "Immanuel Kant - Gemaelde 1",
    "author": "Johann Gottlieb Becker",
    "source": "https://commons.wikimedia.org/wiki/File:Immanuel_Kant_-_Gemaelde_1.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "ethics-1": {
    "kind": "人物肖像",
    "title": "Jeremy Bentham by Henry William Pickersgill",
    "author": "Henry William Pickersgill",
    "source": "https://commons.wikimedia.org/wiki/File:Jeremy_Bentham_by_Henry_William_Pickersgill.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "ethics-2": {
    "kind": "后世绘像",
    "title": "Half Portraits of the Great Sage and Virtuous Men of Old - Meng Ke (孟軻)",
    "author": "佚名，台北国立故宫博物院藏",
    "source": "https://commons.wikimedia.org/wiki/File:Half_Portraits_of_the_Great_Sage_and_Virtuous_Men_of_Old_-_Meng_Ke_(%E5%AD%9F%E8%BB%BB).jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "ethics-3": {
    "kind": "人物肖像",
    "title": "W-D-Ross",
    "author": "Writersfinger",
    "source": "https://commons.wikimedia.org/wiki/File:W-D-Ross.jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "ethics-4": {
    "kind": "人物肖像",
    "title": "Nel Noddings 2011 (cropped)",
    "author": "Jim Noddings",
    "source": "https://commons.wikimedia.org/wiki/File:Nel_Noddings_2011_(cropped).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "happiness-0": {
    "kind": "大理石胸像",
    "title": "Aristotle Altemps Inv8575",
    "author": "雕塑仿 Lysippos 原作，摄影 Jastrow（2006）",
    "source": "https://commons.wikimedia.org/wiki/File:Aristotle_Altemps_Inv8575.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "happiness-1": {
    "kind": "大理石头像",
    "title": "Marble head of Epikouros · 11.90",
    "author": "The Metropolitan Museum of Art，Rogers Fund, 1911",
    "source": "https://www.metmuseum.org/art/collection/search/248475",
    "license": "公共领域",
    "url": "https://www.metmuseum.org/about-the-met/policies-and-documents/open-access"
  },
  "happiness-2": {
    "kind": "后世版画",
    "title": "Epicteti Enchiridion Latinis versibus adumbratum (Oxford 1715) frontispiece (cropped)",
    "author": "William Sonmans / Michael Burghers",
    "source": "https://commons.wikimedia.org/wiki/File:Epicteti_Enchiridion_Latinis_versibus_adumbratum_(Oxford_1715)_frontispiece_(cropped).jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "happiness-3": {
    "kind": "人物肖像",
    "title": "Arthur Schopenhauer by J Schäfer, 1859b",
    "author": "Johann Schäfer",
    "source": "https://commons.wikimedia.org/wiki/File:Arthur_Schopenhauer_by_J_Sch%C3%A4fer,_1859b.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "happiness-4": {
    "kind": "古罗马雕像",
    "title": "Duble herma of Socrates and Seneca Antikensammlung Berlin 07",
    "author": "Calidius · I, Calidius",
    "source": "https://commons.wikimedia.org/wiki/File:Duble_herma_of_Socrates_and_Seneca_Antikensammlung_Berlin_07.jpg",
    "license": "CC BY-SA 3.0",
    "url": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "freedom-0": {
    "kind": "人物肖像",
    "title": "Jean Paul Sartre 1965",
    "author": "摄影者未署名，荷兰国家档案馆 Anefo 摄影集，917-9600",
    "source": "https://commons.wikimedia.org/wiki/File:Jean_Paul_Sartre_1965.jpg",
    "license": "CC BY-SA 3.0 nl",
    "url": "https://creativecommons.org/licenses/by-sa/3.0/nl/deed.en"
  },
  "freedom-1": {
    "kind": "人物肖像",
    "title": "Simone De Beauvoir (cropped)",
    "author": "Moshe Milner · Government Press Office (Israel)",
    "source": "https://commons.wikimedia.org/wiki/File:Simone_De_Beauvoir_(cropped).jpg",
    "license": "CC BY-SA 3.0",
    "url": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "freedom-2": {
    "kind": "人物肖像",
    "title": "Spinoza",
    "author": "佚名",
    "source": "https://commons.wikimedia.org/wiki/File:Spinoza.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "freedom-3": {
    "kind": "人物肖像",
    "title": "Harry Frankfurt at 2017 ACLS Annual Meeting",
    "author": "American Council of Learned Societies (ACLS)",
    "source": "https://commons.wikimedia.org/wiki/File:Harry_Frankfurt_at_2017_ACLS_Annual_Meeting.jpg",
    "license": "CC BY 3.0",
    "url": "https://creativecommons.org/licenses/by/3.0"
  },
  "freedom-4": {
    "kind": "人物肖像",
    "title": "William James b1842c",
    "author": "Notman Studios (photographer)",
    "source": "https://commons.wikimedia.org/wiki/File:William_James_b1842c.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "justice-0": {
    "kind": "人物肖像",
    "title": "John Rawls (1971 photo portrait)",
    "author": "Alec Rawls，初刊于 Harvard University Press / Belknap Press",
    "source": "https://commons.wikimedia.org/wiki/File:John_Rawls_(1971_photo_portrait).jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "justice-1": {
    "kind": "人物肖像",
    "title": "Robert Nozick 1977 Libertarian Review cover (4x5 cropped)",
    "author": "Libertarian Review",
    "source": "https://commons.wikimedia.org/wiki/File:Robert_Nozick_1977_Libertarian_Review_cover_(4x5_cropped).jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "justice-2": {
    "kind": "人物肖像",
    "title": "Amartya Sen 20071128 cologne cropped",
    "author": "摄影 Elke Wetzig（Elya），原裁切 ChaudhryAzan",
    "source": "https://commons.wikimedia.org/wiki/File:Amartya_Sen_20071128_cologne_cropped.jpg",
    "license": "CC BY-SA 3.0",
    "url": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "justice-3": {
    "kind": "人物肖像",
    "title": "Martha Nussbaum 2010 (cropped)",
    "author": "Sally Ryan, photographer, www.sallyryanphoto.com",
    "source": "https://commons.wikimedia.org/wiki/File:Martha_Nussbaum_2010_(cropped).jpg",
    "license": "CC BY-SA 3.0",
    "url": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "justice-4": {
    "kind": "人物素描",
    "title": "Iris Marion Young",
    "author": "Little maquisart",
    "source": "https://commons.wikimedia.org/wiki/File:Iris_Marion_Young.jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "politics-0": {
    "kind": "人物肖像",
    "title": "Thomas Hobbes by John Michael Wright (colour) (3x4 cropped)",
    "author": "John Michael Wright",
    "source": "https://commons.wikimedia.org/wiki/File:Thomas_Hobbes_by_John_Michael_Wright_(colour)_(3x4_cropped).jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "politics-1": {
    "kind": "人物肖像",
    "title": "Charles Montesquieu",
    "author": "据 Jacques-Antoine Dassier 原作",
    "source": "https://commons.wikimedia.org/wiki/File:Charles_Montesquieu.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "politics-2": {
    "kind": "人物肖像",
    "title": "Maurice Quentin de La Tour - Portrait of Jean-Jacques Rousseau - adjusted",
    "author": "Maurice Quentin de La Tour",
    "source": "https://commons.wikimedia.org/wiki/File:Maurice_Quentin_de_La_Tour_-_Portrait_of_Jean-Jacques_Rousseau_-_adjusted.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "politics-3": {
    "kind": "人物肖像",
    "title": "Hannah Arendt auf dem 1. Kulturkritikerkongress, Barbara Niggl Radloff, FM-2019-1-5-9-16 (cropped)",
    "author": "Barbara Niggl Radloff",
    "source": "https://commons.wikimedia.org/wiki/File:Hannah_Arendt_auf_dem_1._Kulturkritikerkongress,_Barbara_Niggl_Radloff,_FM-2019-1-5-9-16_(cropped).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "politics-4": {
    "kind": "人物肖像",
    "title": "John Stuart Mill by London Stereoscopic Company, c1870",
    "author": "London Stereoscopic Company",
    "source": "https://commons.wikimedia.org/wiki/File:John_Stuart_Mill_by_London_Stereoscopic_Company,_c1870.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "labour-0": {
    "kind": "人物肖像",
    "title": "Karl Marx by John Jabez Edwin Mayall 1875 - Restored",
    "author": "John Jabez Edwin Mayall",
    "source": "https://commons.wikimedia.org/wiki/File:Karl_Marx_by_John_Jabez_Edwin_Mayall_1875_-_Restored.png",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "labour-1": {
    "kind": "人物肖像",
    "title": "Freiburg, Zähringen- Jahnhalle, Prof. Martin Heidegger während eines Vortrags - LABW - Staatsarchiv Freiburg W 134 Nr. 023740f (cropped)",
    "author": "Willy Pragher · Landesarchiv Baden-Württemberg, Staatsarchiv Freiburg W 134 Nr. 023740f / Fotograf: Willy Pragher",
    "source": "https://commons.wikimedia.org/wiki/File:Freiburg,_Z%C3%A4hringen-_Jahnhalle,_Prof._Martin_Heidegger_w%C3%A4hrend_eines_Vortrags_-_LABW_-_Staatsarchiv_Freiburg_W_134_Nr._023740f_(cropped).jpeg",
    "license": "CC BY 4.0",
    "url": "https://creativecommons.org/licenses/by/4.0"
  },
  "labour-2": {
    "kind": "人物肖像",
    "title": "Jacques Ellul, 1990 (cropped)",
    "author": "Jan van Boeckel, ReRun Productions",
    "source": "https://commons.wikimedia.org/wiki/File:Jacques_Ellul,_1990_(cropped).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "labour-3": {
    "kind": "藏书票"
  },
  "labour-4": {
    "kind": "人物肖像",
    "title": "Simone Weil 1943",
    "author": "摄影者未署名",
    "source": "https://commons.wikimedia.org/wiki/File:Simone_Weil_1943.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "art-0": {
    "kind": "古典雕像",
    "title": "Plato Silanion Musei Capitolini MC1377",
    "author": "Marie-Lan Nguyen · © Marie-Lan Nguyen / Wikimedia Commons",
    "source": "https://commons.wikimedia.org/wiki/File:Plato_Silanion_Musei_Capitolini_MC1377.png",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "art-1": {
    "kind": "人物肖像",
    "title": "Hans-Georg Gadamer",
    "author": "Leena Ruuskanen",
    "source": "https://commons.wikimedia.org/wiki/File:Hans-Georg_Gadamer.jpg",
    "license": "CC BY 3.0",
    "url": "https://creativecommons.org/licenses/by/3.0"
  },
  "art-2": {
    "kind": "人物肖像",
    "title": "John Dewey cph.3a51565",
    "author": "Underwood & Underwood",
    "source": "https://commons.wikimedia.org/wiki/File:John_Dewey_cph.3a51565.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "art-3": {
    "kind": "人物肖像",
    "title": "Walter Benjamin vers 1928",
    "author": "佚名，柏林艺术学院 Walter Benjamin 档案馆",
    "source": "https://commons.wikimedia.org/wiki/File:Walter_Benjamin_vers_1928.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "art-4": {
    "kind": "人物肖像",
    "title": "Susan Sontag 1979 ©Lynn Gilbert (headshot)",
    "author": "Lynn Gilbert",
    "source": "https://commons.wikimedia.org/wiki/File:Susan_Sontag_1979_%C2%A9Lynn_Gilbert_(headshot).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "knowledge-0": {
    "kind": "铜版肖像",
    "title": "René Descartes，1644 · 2468i",
    "author": "Frans van Schooten，Wellcome Collection 藏",
    "source": "https://wellcomecollection.org/works/rbhqrxm9",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "knowledge-1": {
    "kind": "人物肖像",
    "title": "David Hume Ramsay",
    "author": "Allan Ramsay",
    "source": "https://commons.wikimedia.org/wiki/File:David_Hume_Ramsay.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "knowledge-2": {
    "kind": "人物肖像",
    "title": "Charles Sanders Peirce",
    "author": "NOAA Office of NOAA Corps Operations，原图处理 Ori.livneh",
    "source": "https://commons.wikimedia.org/wiki/File:Charles_Sanders_Peirce.png",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "knowledge-3": {
    "kind": "后世版画",
    "title": "Sextus Empiricus - engraving by G. F. Riedel - 1801",
    "author": "Gottlieb Friedrich Riedel",
    "source": "https://commons.wikimedia.org/wiki/File:Sextus_Empiricus_-_engraving_by_G._F._Riedel_-_1801.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "knowledge-4": {
    "kind": "人物肖像",
    "title": "Miranda Fricker (25652615846)",
    "author": "Edmond J. Safra Center for Ethics",
    "source": "https://commons.wikimedia.org/wiki/File:Miranda_Fricker_(25652615846).jpg",
    "license": "CC BY 2.0",
    "url": "https://creativecommons.org/licenses/by/2.0"
  },
  "science-0": {
    "kind": "人物肖像",
    "title": "Photo of Karl Popper (cropped)",
    "author": "DorianKBandy",
    "source": "https://commons.wikimedia.org/wiki/File:Photo_of_Karl_Popper_(cropped).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "science-1": {
    "kind": "人物肖像",
    "title": "Thomas Kuhn (1977) (cropped)",
    "author": "Bob Bielk",
    "source": "https://commons.wikimedia.org/wiki/File:Thomas_Kuhn_(1977)_(cropped).jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "science-2": {
    "kind": "人物肖像",
    "title": "Pierre Duhem",
    "author": "摄影者未署名",
    "source": "https://commons.wikimedia.org/wiki/File:Pierre_Duhem.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "science-3": {
    "kind": "人物肖像",
    "title": "Paul Feyerabend Berkeley",
    "author": "Grazia Borrini-Feyerabend",
    "source": "https://commons.wikimedia.org/wiki/File:Paul_Feyerabend_Berkeley.jpg",
    "license": "署名许可",
    "url": "https://commons.wikimedia.org/wiki/File:Paul_Feyerabend_Berkeley.jpg#Licensing"
  },
  "science-4": {
    "kind": "人物肖像",
    "title": "Helen E Longino",
    "author": "Helen E Longino",
    "source": "https://commons.wikimedia.org/wiki/File:Helen_E_Longino.jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "language-0": {
    "kind": "人物肖像",
    "title": "Young frege",
    "author": "摄影者未署名",
    "source": "https://commons.wikimedia.org/wiki/File:Young_frege.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "language-1": {
    "kind": "人物肖像",
    "title": "Bertrand Russell in 1936",
    "author": "Bassano Ltd",
    "source": "https://commons.wikimedia.org/wiki/File:Bertrand_Russell_in_1936.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "language-2": {
    "kind": "人物肖像",
    "title": "Ludwig Wittgenstein 1929",
    "author": "Moritz Nähr",
    "source": "https://commons.wikimedia.org/wiki/File:Ludwig_Wittgenstein_1929.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "language-3": {
    "kind": "藏书票"
  },
  "language-4": {
    "kind": "藏书票"
  },
  "mind-0": {
    "kind": "人物肖像",
    "title": "Thomas Nagel (cropped)",
    "author": "Nagelt",
    "source": "https://commons.wikimedia.org/wiki/File:Thomas_Nagel_(cropped).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "mind-1": {
    "kind": "人物肖像",
    "title": "Daniel Dennett 2",
    "author": "Dmitry Rozhkov",
    "source": "https://commons.wikimedia.org/wiki/File:Daniel_Dennett_2.jpg",
    "license": "CC BY-SA 3.0",
    "url": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "mind-2": {
    "kind": "人物肖像",
    "title": "David chalmers",
    "author": "DannyGolcman",
    "source": "https://commons.wikimedia.org/wiki/File:David_chalmers.jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "mind-3": {
    "kind": "藏书票"
  },
  "mind-4": {
    "kind": "人物肖像",
    "title": "Maurice Merleau-Ponty",
    "author": "Perig Gouanvic（Philosophical Investigations）",
    "source": "https://commons.wikimedia.org/wiki/File:Maurice_Merleau-Ponty.jpg",
    "license": "CC BY 3.0",
    "url": "https://creativecommons.org/licenses/by/3.0"
  },
  "identity-0": {
    "kind": "人物肖像",
    "title": "Godfrey Kneller - Portrait of John Locke (Hermitage)",
    "author": "Godfrey Kneller",
    "source": "https://commons.wikimedia.org/wiki/File:Godfrey_Kneller_-_Portrait_of_John_Locke_(Hermitage).jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "identity-1": {
    "kind": "人物肖像",
    "title": "Derek Parfit at Harvard-April 21, 2015-Effective Altruism (cropped)",
    "author": "Anna Riedl",
    "source": "https://commons.wikimedia.org/wiki/File:Derek_Parfit_at_Harvard-April_21,_2015-Effective_Altruism_(cropped).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "identity-2": {
    "kind": "人物肖像",
    "title": "ThomasReid",
    "author": "Sir Henry Raeburn",
    "source": "https://commons.wikimedia.org/wiki/File:ThomasReid.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "identity-3": {
    "kind": "藏书票"
  },
  "identity-4": {
    "kind": "藏书票"
  },
  "change-0": {
    "kind": "后世绘像",
    "title": "Hendrik ter Brugghen - Heraclitus",
    "author": "Hendrick ter Brugghen",
    "source": "https://commons.wikimedia.org/wiki/File:Hendrik_ter_Brugghen_-_Heraclitus.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "change-1": {
    "kind": "传统题名雕像",
    "title": "Busto di Parmenide (cropped)",
    "author": "Sergio Spolti",
    "source": "https://commons.wikimedia.org/wiki/File:Busto_di_Parmenide_(cropped).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "change-2": {
    "kind": "明代绘像",
    "title": "Zhang Lu-Laozi Riding an Ox (cropped)",
    "author": "Zhang Lu",
    "source": "https://commons.wikimedia.org/wiki/File:Zhang_Lu-Laozi_Riding_an_Ox_(cropped).jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "change-3": {
    "kind": "人物肖像",
    "title": "ANWhitehead",
    "author": "摄影者未署名",
    "source": "https://commons.wikimedia.org/wiki/File:ANWhitehead.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "change-4": {
    "kind": "人物肖像",
    "title": "Henri Bergson 02",
    "author": "Henri Manuel",
    "source": "https://commons.wikimedia.org/wiki/File:Henri_Bergson_02.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "ecology-0": {
    "kind": "《玄门十子图》局部",
    "title": "玄門十子圖 莊子",
    "author": "Hua Zili (華祖立)",
    "source": "https://commons.wikimedia.org/wiki/File:%E7%8E%84%E9%96%80%E5%8D%81%E5%AD%90%E5%9C%96_%E8%8E%8A%E5%AD%90.jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "ecology-1": {
    "kind": "人物肖像",
    "title": "Arnenass28aug2003",
    "author": "Vindheim",
    "source": "https://commons.wikimedia.org/wiki/File:Arnenass28aug2003.jpg",
    "license": "CC BY-SA 3.0",
    "url": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "ecology-2": {
    "kind": "人物肖像",
    "title": "Aldo Leopold, 1946 (cropped)",
    "author": "Howard Zahniser",
    "source": "https://commons.wikimedia.org/wiki/File:Aldo_Leopold,_1946_(cropped).jpg",
    "license": "公共领域",
    "url": "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  "ecology-3": {
    "kind": "人物肖像",
    "title": "Val Plumwood (1990, cropped)",
    "author": "摄影 Sean Kenan，原图裁切 SarahSV",
    "source": "https://commons.wikimedia.org/wiki/File:Val_Plumwood_(1990,_cropped).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "ecology-4": {
    "kind": "人物肖像",
    "title": "Bruno Latour in Taiwan P1250394 (cropped)",
    "author": "KOKUYO",
    "source": "https://commons.wikimedia.org/wiki/File:Bruno_Latour_in_Taiwan_P1250394_(cropped).jpg",
    "license": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0"
  }
};
  const escape = value => String(value).replace(/[&<>"']/g, character => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[character]);
  const link = (url, label) => '<a href="' + escape(url) + '" target="_blank" rel="noopener noreferrer">' + escape(label) + '</a>';
  function render(topic, index) {
    const key = topic?.id + "-" + index;
    const person = topic?.people?.[index];
    const plate = plates[key];
    if (!plate || !person) return "";
    const book = person.book.startsWith("《") ? person.book : "《" + person.book + "》";
    const bookplate = plate.kind === "藏书票";
    const subject = bookplate ? book + "藏书票" : person.name + "，" + plate.kind;
    const description = bookplate
      ? '<p>《思想之间》据' + escape(person.name) + '的' + escape(book) + '绘制。</p>'
      : '<p>' + escape(plate.author) + '</p><p>' + link(plate.source,plate.title) + '</p><p>' +
        link(plate.url, plate.license) + '。本页作了局部裁切、暖灰调色与加网。' + (plate.license.includes("BY-SA") ? '此改编图版按同一许可发布。' : '') + '</p>';
    return '<figure class="result-art"><img class="result-art-image" src="assets/result-portraits/' + escape(key) +
      '.webp" width="640" height="544" alt="' + escape(subject) + '"><figcaption><span>' + escape(plate.kind) +
      '</span><details class="art-credit"><summary>图版说明</summary><div>' + description + '</div></details></figcaption></figure>';
  }
  window.ResultArt = Object.freeze({render});
})();