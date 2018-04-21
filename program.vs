class LinkedList {
    Node {
        data: int,
        reference: Node
    }

    head = null;

    fun insert(value: Node): void {
        if(head == null) {
            head = Node(value);
        } else {
            aux = head;
            while(aux.reference != null) {
                aux = aux.reference;
            }
            aux.reference = Node(value);
        }
    }
}