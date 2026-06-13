import { useMemo, useState } from 'react';
import CopyableCodeBlock from './CopyableCodeBlock.jsx';
import { dataReferenceSections } from '../reference/dataReferenceCatalog.js';

export function getDataReferenceItems() {
  return dataReferenceSections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      sectionTitle: section.title,
      sectionId: section.id,
    })),
  );
}

const dataTopicIconBySectionId = {
  'big-picture': 'FLOW',
  shape: 'OBJ',
  helpers: 'HELP',
  transform: 'MAP',
  contract: 'DONE',
};

function getDataTopicIcon(sectionId) {
  return dataTopicIconBySectionId[sectionId] ?? 'DATA';
}

function DataPipelineVisual() {
  return (
    <div className="conceptDataPipeline">
      <span className="conceptDataStage isRaw">raw API data</span>
      <span className="conceptDataArrow" />
      <span className="conceptDataStage isNormalize">normalize()</span>
      <span className="conceptDataArrow" />
      <span className="conceptDataStage isClean">clean model</span>
      <span className="conceptDataArrow" />
      <span className="conceptDataStage isRender">render PDF</span>
    </div>
  );
}

function RawCleanVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataObject">
        <span>quo_cus_name</span>
        <span>qrp_toal</span>
        <span>quo_valid_untill</span>
      </div>
      <span className="conceptDataTransformLabel">rename + group</span>
      <div className="conceptDataRows">
        <span>customer.name</span>
        <span>item.unitPrice</span>
        <span>document.validUntil</span>
      </div>
    </div>
  );
}

function ObjectShapeVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataObject">
        <span>document</span>
        <span>customer</span>
        <span>items[]</span>
        <span>totals</span>
      </div>
      <span className="conceptDataModelLabel">quotation model</span>
    </div>
  );
}

function ArrayItemsVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataRows">
        <span>{'items[0] -> row 1'}</span>
        <span>{'items[1] -> row 2'}</span>
        <span>{'items[2] -> row 3'}</span>
      </div>
      <span className="conceptDataModelLabel">one item = one table row</span>
    </div>
  );
}

function SafeValueVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataObject">
        <span>{"null -> '-'"}</span>
        <span>{"undefined -> '-'"}</span>
        <span>{"'1200' -> 1200"}</span>
      </div>
      <span className="conceptDataModelLabel">safe helpers protect renderer</span>
    </div>
  );
}

function MoneyFormatVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataObject">
        <span>1200.5</span>
        <span>calculate as number</span>
      </div>
      <span className="conceptDataTransformLabel">money()</span>
      <div className="conceptDataRows">
        <span>1,200.50</span>
        <span>align: right</span>
      </div>
    </div>
  );
}

function DateFormatVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataObject">
        <span>2026-06-13</span>
        <span>raw ISO / API date</span>
      </div>
      <span className="conceptDataTransformLabel">thaiDate()</span>
      <div className="conceptDataRows">
        <span>13/06/2569</span>
        <span>display date</span>
      </div>
    </div>
  );
}

function MapVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataRows">
        <span>{'raw item A -> clean item A'}</span>
        <span>{'raw item B -> clean item B'}</span>
        <span>{'raw item C -> clean item C'}</span>
      </div>
      <span className="conceptDataModelLabel">map keeps array length</span>
    </div>
  );
}

function ReduceVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataRows">
        <span>row total 120</span>
        <span>row total 80</span>
        <span>row total 300</span>
      </div>
      <span className="conceptDataTransformLabel">reduce()</span>
      <div className="conceptDataObject">
        <span>subtotal 500</span>
      </div>
    </div>
  );
}

function NormalizeVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataObject">
        <span>normalizeDocument()</span>
        <span>normalizeCustomer()</span>
        <span>normalizeItem()</span>
        <span>buildTotals()</span>
      </div>
      <span className="conceptDataModelLabel">normalizeQuotation(raw)</span>
    </div>
  );
}

function RenderContractVisual() {
  return (
    <div className="conceptDataPaper">
      <div className="conceptDataObject">
        <span>generateQuotationPdf(quotation)</span>
        <span>drawHeader(model)</span>
        <span>drawRows(model.items)</span>
      </div>
      <div className="conceptDataRows">
        <span>no raw.quo_cus_name</span>
        <span>no qrp_toal in renderer</span>
      </div>
    </div>
  );
}

function DataConceptVisual({ item }) {
  switch (item.visualKind) {
    case 'data-flow':
      return <DataPipelineVisual />;
    case 'raw-clean':
      return <RawCleanVisual />;
    case 'object-shape':
      return <ObjectShapeVisual />;
    case 'array-items':
      return <ArrayItemsVisual />;
    case 'safe-value':
      return <SafeValueVisual />;
    case 'money-format':
      return <MoneyFormatVisual />;
    case 'date-format':
      return <DateFormatVisual />;
    case 'map':
      return <MapVisual />;
    case 'reduce':
      return <ReduceVisual />;
    case 'normalize':
      return <NormalizeVisual />;
    case 'render-contract':
      return <RenderContractVisual />;
    default:
      return <DataPipelineVisual />;
  }
}

function DataReferenceTeachingPanel({ item }) {
  return (
    <>
      <div className="conceptSurface">
        <DataConceptVisual item={item} />
      </div>

      <div className="conceptDetailPanel">
        <code>{item.signature}</code>
        <p>{item.mentalModel}</p>
        <dl>
          {item.parameters.map((parameter) => (
            <div key={parameter.name}>
              <dt>{parameter.name}</dt>
              <dd>{parameter.detail}</dd>
            </div>
          ))}
        </dl>
        <CopyableCodeBlock code={item.example} />
      </div>
    </>
  );
}

function DataReferenceWorkspace() {
  const referenceItems = useMemo(() => getDataReferenceItems(), []);
  const [selectedReferenceId, setSelectedReferenceId] = useState(referenceItems[0]?.id);
  const selectedReference =
    referenceItems.find((item) => item.id === selectedReferenceId) ?? referenceItems[0];

  return (
    <>
      <section className="lessonPane referencePane" aria-labelledby="data-reference-title">
        <div className="lessonHeader">
          <p className="eyebrow">Data Ref / Normalize Model</p>
          <h2 id="data-reference-title">สารบัญจัดข้อมูล</h2>
          <p>
            เริ่มจากข้อมูลดิบ จัดรูปเป็น clean model แล้วค่อยส่งเข้า function ที่วาด PDF
            เพื่อให้เอกสารธุรกิจอ่านง่ายและตรวจง่าย
          </p>
        </div>

        <div className="referenceTopicGroups">
          {dataReferenceSections.map((section) => (
            <section key={section.id} className="referenceTopicGroup">
              <div className="referenceTopicGroupHeader">
                <h3>{section.title}</h3>
                <p>{section.summary}</p>
              </div>
              <div className="referenceTopicList">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`referenceTopicCard ${
                      selectedReference.id === item.id ? 'isSelected' : ''
                    }`}
                    onClick={() => setSelectedReferenceId(item.id)}
                  >
                    <span className="referenceTopicIcon isDataIcon" aria-hidden="true">
                      {getDataTopicIcon(section.id)}
                    </span>
                    <span className="referenceTopicBody">
                      <span className="referenceTopicName">{item.name}</span>
                      <code>{item.signature}</code>
                      <small>{item.apiType}</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="previewPane conceptPane" aria-labelledby="data-concept-title">
        <div className="previewHeader">
          <p className="eyebrow">
            {selectedReference.sectionTitle} / {selectedReference.apiType}
          </p>
          <h2 id="data-concept-title">{selectedReference.name}</h2>
        </div>

        <DataReferenceTeachingPanel item={selectedReference} />
      </section>
    </>
  );
}

export default DataReferenceWorkspace;
