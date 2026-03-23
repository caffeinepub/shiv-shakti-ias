import { HttpAgent } from "@icp-sdk/core/agent";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

async function createStorageClient() {
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => {});
  }
  return new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
}

/**
 * Uploads a Blob to blob storage and returns the hash string (blobId).
 */
export async function uploadBlob(
  blob: Blob,
  onProgress?: (percentage: number) => void,
): Promise<string> {
  const storageClient = await createStorageClient();
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const { hash } = await storageClient.putFile(bytes, onProgress);
  return hash;
}

/**
 * Returns the direct URL for a blobId (hash string).
 */
export async function getBlobUrl(blobId: string): Promise<string> {
  const storageClient = await createStorageClient();
  return storageClient.getDirectURL(blobId);
}
